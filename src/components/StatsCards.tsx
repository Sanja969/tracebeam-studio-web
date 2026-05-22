import type { Event } from "../types/event";
import { cards } from "../utils/utils";

type Props = {
  events: Event[];
};



export const StatsCards = ({ events }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`border rounded-2xl p-5 ${card.className}`}
        >
          <p className={`text-sm mb-2 ${card.labelClassName}`}>
            {card.label}
          </p>

          <h2 className="text-3xl font-bold">
            {card.getValue(events)}
          </h2>
        </div>
      ))}
    </div>
  );
};