import { SVGProps } from "react";

const Clock = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      fill="#ffdd00"
    />
    ;
  </svg>
);

export default Clock;
