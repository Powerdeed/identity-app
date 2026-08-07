"use clients";

import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type CardDesc = {
  value: number;
  desc: string;
  color: string;
};

export type Card = {
  [x: string]: CardDesc;
};

export type Action = {
  actionType: string;
  action: string;
  summary: string;
  icon: IconProp;
  color: string;
};

export type Change = {
  changeType: string;
  change: string;
  time: string;
};

export default function useDashboardApi() {
  const cardData: Card = {
    "PENDING ACTIVATION": {
      value: 1,
      desc: "Awaiting provisioning",
      color: "text-(--secondary-red)",
    },
    "ACTIVE WORKFORCE": {
      value: 9,
      desc: "Enabled accounts",
      color: "text-(--primary-green)",
    },
    SUSPENDED: {
      value: 1,
      desc: "Access blocked",
      color: "text-(--secondary-red)",
    },
    "EXPIRING TEMP ACCESS": {
      value: 3,
      desc: "Within 7 days",
      color: "text-(--secondary-red)",
    },
    "ACTIVE SESSIONS": {
      value: 11,
      desc: "Across all devices",
      color: "text-(--secondary-blue)",
    },
    "OVERDUE REVIEWS": {
      value: 2,
      desc: "Require attention",
      color: "text-(--primary-red)",
    },
  };

  const actionQueue: Action[] = [
    {
      actionType: "Provision",
      action: "Tobias Richter",
      summary: "Awaiting provisioning",
      icon: ["fas", "user-plus"],
      color: "text-(--secondary-blue)",
    },
    {
      actionType: "Review",
      action: "Chiamaka Eze — cms:publisher",
      summary: "Temporary access expires in 2 days",
      icon: ["far", "clock"],
      color: "text-(--primary-yellow)",
    },
    {
      actionType: "Escalate",
      action: "Executive Access Review",
      summary: "Overdue by 13 days — 30% complete",
      icon: ["fas", "triangle-exclamation"],
      color: "text-(--secondary-red)",
    },
    {
      actionType: "Inspect",
      action: "Musa Diallo",
      summary: "Recently suspended — verify access cleared",
      icon: ["fas", "ban"],
      color: "text-(--primary-red)",
    },
    {
      actionType: "View",
      action: "CMS Publisher Role Audit",
      summary: "Escalated — awaiting reviewer response",
      icon: ["far", "clock"],
      color: "text-(--primary-yellow)",
    },
    {
      actionType: "View Queue",
      action: "3 pending provision requests",
      summary: "Keycloak users matched — awaiting identity setup",
      icon: ["fas", "user-plus"],
      color: "text-(--secondary-blue)",
    },
  ];

  const changeTypeColor = {
    "Lifecycle-provision": "bg-(--primary-blue)",
    "Lifecycle-suspend": "bg-(--primary-red)",
    "Lifecycle-archive": "bg-(--primary-grey)",
    "Access-add": "bg-(--primary-green)",
    "Access-remove": "bg-(--primary-red)",
  };

  const recentChanges: Change[] = [
    {
      changeType: "Lifecycle-provision",
      change: "Tobias Richter provisioned",
      time: "3 days ago",
    },
    {
      changeType: "Lifecycle-suspend",
      change: "Musa Diallo suspended",
      time: "14 days ago",
    },
    {
      changeType: "Lifecycle-archive",
      change: "Chiamaka Eze archived",
      time: "62 days ago",
    },
    {
      changeType: "Access-add",
      change: "platform:engineer → Priya Sharma",
      time: "Today 08:30",
    },
    {
      changeType: "Access-add",
      change: "finance:analyst group → Kwame Asante",
      time: "Yesterday",
    },
    {
      changeType: "Access-remove",
      change: "ops:deployer removed — Musa Diallo",
      time: "14 days ago",
    },
  ];

  return { cardData, actionQueue, recentChanges, changeTypeColor };
}
