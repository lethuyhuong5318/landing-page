"use client";

interface StatCard {
  percentage: string;
  label: string;
}

interface StatisticsSectionProps {
  stats?: StatCard[];
  improvement?: {
    value: string;
    description: string;
  };
}

const DEFAULT_STATS: StatCard[] = [
  { percentage: "80%", label: "học sinh bổ sung nền từ đầu" },
  { percentage: "73%", label: "học sinh lấy gốc từ A đến Z" },
  { percentage: "97%", label: "lần thi lần qua 3.3" },
];

const DEFAULT_IMPROVEMENT = {
  value: "+3.5 điểm",
  description: "sau 2 tuần học",
};

export default function StatisticsSection({
  stats = DEFAULT_STATS,
  improvement = DEFAULT_IMPROVEMENT,
}: StatisticsSectionProps) {
  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-700 to-teal-600 rounded-lg p-6 md:p-8 text-white shadow-lg"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.percentage}
              </div>
              <div className="text-sm md:text-base text-blue-100 leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Improvement Badge */}
        <div className="flex items-center gap-2 bg-green-50 rounded-lg px-4 md:px-6 py-3 md:py-4 border border-green-200 w-fit">
          <span className="text-green-600 font-semibold text-lg">
            {improvement.value}
          </span>
          <span className="text-gray-600 text-sm md:text-base">
            {improvement.description}
          </span>
        </div>
      </div>
    </section>
  );
}
