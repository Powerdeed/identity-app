export const convertLabelToLink = (label: string) => {
  if (label.includes("&")) {
    // label separated with "&" e.g. "Leads & Inquiries" => "leads&inquiries"
    return label.toLocaleLowerCase().split(" ").join("");
  } else if (label.includes("/")) {
    // label separated with "/" e.g. "Leads/Inquiries" => "leads-inquiries"
    return label.toLocaleLowerCase().split("/").join("-");
  } else {
    // label separated with space e.g. "Website Content" => "website-content"
    return label.toLocaleLowerCase().split(" ").join("-");
  }
};

export const convertLinkToLabel = (link: string) => {
  const exceptionLinks: Record<string, string> = {
    "joiners-movers-leavers": "Joiners/Movers/Leavers",
  };

  if (exceptionLinks[link]) return exceptionLinks[link];

  if (link.includes("&")) {
    // link separated with "&" e.g. "leads&inquiries" => "Leads & Inquiries"
    return link
      .split("&")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" & ");
  } else {
    // link separated with "-" e.g. "website-content" => "Website Content"
    return link
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
};
