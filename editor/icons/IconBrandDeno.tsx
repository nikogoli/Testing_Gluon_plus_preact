/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

// このファイルは "https://github.com/hashrock/tabler-icons-tsx" に ↑ の pragma の記述を追加したもの
// (正確なパス: "https://raw.githubusercontent.com/hashrock/tabler-icons-tsx/main/tsx/brand-deno.tsx")
// fresh の利用を前提にした pragma が省略されたファイルを読み込むと renderToString() が
// "error: Uncaught (in promise) ReferenceError: React is not defined" のエラーを吐くため、ローカルにおいて対処している

export default function IconBrandDeno({
    size = 24,
    color = "currentColor",
    stroke = 2,
    ...props
  }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-brand-deno"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke-width={stroke}
        stroke={color}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...props}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx={12} cy={12} r={9} />
        <path d="M13.47 20.882l-1.47 -5.882c-2.649 -.088 -5 -1.624 -5 -3.5c0 -1.933 2.239 -3.5 5 -3.5s4 1 5 3c.024 .048 .69 2.215 2 6.5" />
        <path d="M12 11h.01" />
      </svg>
    );
  }