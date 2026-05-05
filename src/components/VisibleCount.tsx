interface Props {
  visible: number;
  total: number;
}

export default function VisibleCount({ visible, total }: Props) {
  return (
    <>
      Rodoma{" "}
      <span className="text-ink tabular-nums">
        {String(visible).padStart(2, "0")}
      </span>
      {" / "}
      <span className="tabular-nums">
        {String(total).padStart(2, "0")}
      </span>{" "}
      taškų
    </>
  );
}
