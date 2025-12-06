import CardStat from "../../../components/CardStat";
import EventList from "../../../components/EventList";
import Anniversaries from "../../../components/Anniversaries";
import HistorySection from "../../../components/HistorySection";


export default function AuthenticationPage() {
  return (

    <div className="p-6 space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat title="Total Member" value="112,361" />
        <CardStat title="Total Family" value="24,560" />
        <CardStat title="Tổng Quyên Góp (donate)" value="45M" />
      </div>

      {/* Events section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-xl shadow">Coming Up Events</div>
        <EventList />
      </div>

      {/* Anniversaries */}
      <Anniversaries />

      {/* History Section */}
      <HistorySection />
    </div>
  );
}
