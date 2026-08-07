"use client";

import useDashboard from "../hooks/useDashboard";
import { Card, CardDesc } from "../hooks/useDashboardApi";

export default function DashboardCards() {
  const { actions } = useDashboard();

  return (
    <div className="grid grid-cols-3 gap-5">
      {Object.entries(actions.cardData).map((card) => (
        <DashboardCard key={card[0]} card={card} />
      ))}
    </div>
  );
}

function DashboardCard({ card }: { card: [keyof Card, CardDesc] }) {
  return (
    <div className="feature-container-vertical">
      <div className="text-style__body">{card[0]}</div>
      <div className={`text-style__heading ${card[1].color}`}>
        {card[1].value}
      </div>
      <div className="text-style__small-text">{card[1].desc}</div>
    </div>
  );
}
