import { Icon } from "@/lib/icons";

export default function Check({ small = false }: { small?: boolean }) {
  return (
    <i className={`grid shrink-0 place-items-center rounded-full bg-brand text-white ${small ? "size-[26px]" : "size-8"}`}>
      <Icon name="check" className="size-[17px]" strokeWidth={3} />
    </i>
  );
}
