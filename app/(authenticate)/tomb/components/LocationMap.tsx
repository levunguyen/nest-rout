import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface LocationPoint {
    id: string;
    name: string;
    cemetery: string;
    x: number;
    y: number;
}

const locations: LocationPoint[] = [
    { id: "1", name: "Ông Nội", cemetery: "Nghĩa trang Bình Hưng Hòa", x: 25, y: 35 },
    { id: "2", name: "Bà Nội", cemetery: "Nghĩa trang Bình Hưng Hòa", x: 30, y: 38 },
    { id: "3", name: "Ông Ngoại", cemetery: "Nghĩa trang Đa Phước", x: 65, y: 55 },
    { id: "4", name: "Bà Ngoại", cemetery: "Nghĩa trang Đa Phước", x: 70, y: 52 },
    { id: "5", name: "Chú Hai", cemetery: "Nghĩa trang Củ Chi", x: 45, y: 25 },
];

const LocationMap = () => {
    return (
        <section className="bg-secondary/50 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-10 text-center"
                >
                    <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Bản Đồ Nghĩa Trang
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl font-sans text-muted-foreground">
                        Vị trí nơi an nghỉ của các thành viên trong gia đình
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative mx-auto aspect-[16/10] max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
                >
                    {/* Map Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-memorial-cream via-card to-secondary/30">
                        {/* Grid lines */}
                        <svg className="absolute inset-0 h-full w-full opacity-20">
                            <defs>
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-memorial-stone" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>

                        {/* Decorative elements */}
                        <div className="absolute left-[10%] top-[20%] h-16 w-16 rounded-full bg-memorial-sage/10" />
                        <div className="absolute right-[15%] top-[40%] h-24 w-24 rounded-full bg-memorial-sage/5" />
                        <div className="absolute bottom-[25%] left-[40%] h-20 w-20 rounded-full bg-memorial-earth/5" />
                    </div>

                    {/* Location Markers */}
                    {locations.map((loc, index) => (
                        <motion.div
                            key={loc.id}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="group absolute cursor-pointer"
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-full">
                                {/* Pulse animation */}
                                <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                                    <div className="h-4 w-4 animate-ping rounded-full bg-memorial-sage/30" />
                                </div>

                                {/* Pin */}
                                <div className="flex flex-col items-center">
                                    <div className="rounded-full bg-primary p-2 shadow-lg transition-transform duration-300 group-hover:scale-110">
                                        <MapPin className="h-4 w-4 text-primary-foreground" />
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground/90 px-3 py-2 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                                        <p className="font-serif text-sm font-semibold text-primary-foreground">
                                            {loc.name}
                                        </p>
                                        <p className="font-sans text-xs text-primary-foreground/80">
                                            {loc.cemetery}
                                        </p>
                                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground/90" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 rounded-lg border border-border/50 bg-card/95 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-memorial-sage" />
                            <span className="font-sans text-xs text-muted-foreground">
                                {locations.length} vị trí
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LocationMap;
