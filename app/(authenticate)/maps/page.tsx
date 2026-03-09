"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

interface ApiFamilyMember {
  id: string;
  fullName: string;
  relation?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

interface MemberItem {
  id: string;
  name: string;
  relation: string;
  age: number | null;
  address?: string;
  city?: string;
  country?: string;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface MarkerItem {
  id: string;
  name: string;
  relation: string;
  lat: number;
  lng: number;
  age: number | null;
  isActive: boolean;
}

const LeafletFamilyMap = dynamic(
  () =>
    import("./components/LeafletFamilyMap").then((mod) => ({
      default: mod.LeafletFamilyMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-[#64748B]">
        Đang tải bản đồ...
      </div>
    ),
  },
);

const calcAge = (birthYear?: number | null, deathYear?: number | null) => {
  if (!birthYear || birthYear <= 0) return null;
  const currentYear = new Date().getFullYear();
  const finalYear = deathYear && deathYear > 0 ? deathYear : currentYear;
  const age = finalYear - birthYear;
  return age > 0 ? age : null;
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const jitterAround = (center: GeoPoint, seed: string, index: number) => {
  const h = hashString(seed);
  const angle = ((h % 360) * Math.PI) / 180 + index * 0.55;
  const distance = 0.0012 + ((h % 5) * 0.00045);
  return {
    lat: center.lat + Math.cos(angle) * distance,
    lng: center.lng + Math.sin(angle) * distance,
  };
};

export default function MapsPage() {
  const router = useRouter();
  const geoCacheRef = useRef<Record<string, GeoPoint>>({});

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [appliedCity, setAppliedCity] = useState("");
  const [appliedCountry, setAppliedCountry] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [centerPoint, setCenterPoint] = useState<GeoPoint>({ lat: 16.0471, lng: 108.2068 });
  const [memberMarkerMap, setMemberMarkerMap] = useState<Record<string, GeoPoint>>({});
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isResolvingMap, setIsResolvingMap] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoadingMembers(true);
      setError("");
      try {
        const response = await fetch("/api/family-members", {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (!response.ok) {
          setError(payload?.error ?? "Không thể tải dữ liệu bản đồ.");
          setMembers([]);
          return;
        }

        const rows = Array.isArray(payload?.data) ? (payload.data as ApiFamilyMember[]) : [];
        const mapped = rows.map((item) => ({
          id: item.id,
          name: item.fullName,
          relation: item.relation?.trim() || "Thành viên",
          age: calcAge(item.birthYear, item.deathYear),
          address: item.address?.trim() || undefined,
          city: item.city?.trim() || undefined,
          country: item.country?.trim() || undefined,
        }));
        setMembers(mapped);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Không thể tải dữ liệu bản đồ.");
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    load();
    return () => controller.abort();
  }, [router]);

  const filteredMembers = useMemo(() => {
    if (!hasSearched) return [];
    const qCity = appliedCity.trim().toLowerCase();
    const qCountry = appliedCountry.trim().toLowerCase();
    return members.filter((member) => {
      const city = (member.city ?? "").toLowerCase();
      const country = (member.country ?? "").toLowerCase();
      const cityOk = qCity ? city.includes(qCity) : true;
      const countryOk = qCountry ? country.includes(qCountry) : true;
      return cityOk && countryOk;
    });
  }, [appliedCity, appliedCountry, hasSearched, members]);

  useEffect(() => {
    if (!hasSearched) {
      setMemberMarkerMap({});
      setActiveMarkerId(null);
      return;
    }
    if (filteredMembers.length === 0) {
      setMemberMarkerMap({});
      setActiveMarkerId(null);
      return;
    }

    const run = async () => {
      setIsResolvingMap(true);
      const nextCache = geoCacheRef.current;
      const markerMap: Record<string, GeoPoint> = {};

      const centerQuery = [appliedCity, appliedCountry].filter(Boolean).join(", ");
      let center = centerQuery ? nextCache[centerQuery] : undefined;
      if (!center && centerQuery.length > 1) {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(centerQuery)}`, {
          method: "GET",
        });
        const payload = await response.json().catch(() => ({}));
        center = payload?.data
          ? ({ lat: payload.data.lat, lng: payload.data.lng } as GeoPoint)
          : undefined;
        if (center) nextCache[centerQuery] = center;
      }
      if (!center) center = { lat: 16.0471, lng: 108.2068 };

      for (let index = 0; index < filteredMembers.length; index += 1) {
        const member = filteredMembers[index];
        const fullAddress = [member.address, member.city, member.country].filter(Boolean).join(", ");
        let point: GeoPoint | undefined;

        if (fullAddress.length > 5) {
          point = nextCache[fullAddress];
          if (!point) {
            const response = await fetch(`/api/geocode?q=${encodeURIComponent(fullAddress)}`, {
              method: "GET",
            });
            const payload = await response.json().catch(() => ({}));
            point = payload?.data
              ? ({ lat: payload.data.lat, lng: payload.data.lng } as GeoPoint)
              : undefined;
            if (point) nextCache[fullAddress] = point;
          }
        }

        markerMap[member.id] = point ?? jitterAround(center, `${member.id}:${centerQuery}`, index);
      }

      geoCacheRef.current = nextCache;
      setCenterPoint(center);
      setMemberMarkerMap(markerMap);
      setActiveMarkerId((prev) => prev ?? filteredMembers[0]?.id ?? null);
      setIsResolvingMap(false);
    };

    run().catch(() => {
      setIsResolvingMap(false);
    });
  }, [appliedCity, appliedCountry, filteredMembers, hasSearched]);

  const mapMarkers: MarkerItem[] = useMemo(
    () =>
      filteredMembers
        .map((member) => {
          const point = memberMarkerMap[member.id];
          if (!point) return null;
          return {
            id: member.id,
            name: member.name,
            relation: member.relation,
            lat: point.lat,
            lng: point.lng,
            age: member.age,
            isActive: activeMarkerId === member.id,
          } satisfies MarkerItem;
        })
        .filter((item): item is MarkerItem => Boolean(item)),
    [activeMarkerId, filteredMembers, memberMarkerMap],
  );

  const handleSearch = () => {
    const city = cityInput.trim();
    const country = countryInput.trim();
    if (!city && !country) {
      setHasSearched(false);
      setAppliedCity("");
      setAppliedCountry("");
      return;
    }
    setAppliedCity(city);
    setAppliedCountry(country);
    setHasSearched(true);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] p-4 text-[#0F172A] md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
            <MapPin className="h-3.5 w-3.5" />
            Family location map
          </span>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Tra cứu thành viên theo địa điểm</h1>
          <p className="mt-2 text-sm text-[#475569]">
            Nhập thành phố và quốc gia, bấm Search để hiển thị marker các thành viên phù hợp.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Thành phố"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <input
              value={countryInput}
              onChange={(event) => setCountryInput(event.target.value)}
              placeholder="Quốc gia"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
            >
              Search
            </button>
          </div>

          {hasSearched && (
            <p className="mt-3 text-sm text-[#475569]">
              Kết quả: <span className="font-semibold text-[#166534]">{filteredMembers.length}</span> marker
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="h-[74vh] min-h-[520px]">
            {!hasSearched ? (
              <div className="flex h-full items-center justify-center p-6">
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] px-5 py-4 text-center">
                  <p className="font-semibold text-[#334155]">Chưa tìm kiếm</p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Hãy nhập thành phố/quốc gia rồi bấm Search để xem marker.
                  </p>
                </div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6">
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] px-5 py-4 text-center">
                  <p className="font-semibold text-[#334155]">Không có dữ liệu phù hợp</p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Thử đổi thành phố hoặc quốc gia để tìm kiếm lại.
                  </p>
                </div>
              </div>
            ) : (
              <LeafletFamilyMap
                center={centerPoint}
                markers={mapMarkers}
                onSelectMarker={setActiveMarkerId}
              />
            )}
          </div>
        </section>

        {(isLoadingMembers || isResolvingMap) && (
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 text-sm text-[#475569]">
            {isLoadingMembers ? "Đang tải dữ liệu thành viên..." : "Đang định vị marker theo địa chỉ..."}
          </section>
        )}

        {error && (
          <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </section>
        )}
      </div>
    </main>
  );
}
