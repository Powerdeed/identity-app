"use client";

import Button from "@/global components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="feature-container-vertical">
      <div className="text-style__big-text">Quick Actions</div>

      <div className="horizontal-layout">
        <Link href="/joiners-movers-leavers">
          <Button buttonText="Provision Person" flipDirection>
            <FontAwesomeIcon icon={["fas", "user-plus"]} />
          </Button>
        </Link>

        <Link href="/people">
          <Button buttonType="light" buttonText="Find Person" flipDirection>
            <FontAwesomeIcon icon={["fas", "magnifying-glass"]} />
          </Button>
        </Link>

        <Link href="/access-reviews">
          <Button
            buttonType="light"
            buttonText="Review Expiring Access"
            flipDirection
          >
            <FontAwesomeIcon icon={["fas", "clipboard-list"]} />
          </Button>
        </Link>

        <Link href="/sessions&devices">
          <Button
            buttonType="light"
            buttonText="View Active Sessions"
            flipDirection
          >
            <FontAwesomeIcon icon={["fas", "tv"]} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
