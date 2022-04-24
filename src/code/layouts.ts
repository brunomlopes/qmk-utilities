export type KeymapLayout = string[];

export type BoardLayout = Array<Array<(layout: KeymapLayout) => string>>;

export class LayoutLayer {
  name: string;
  layout_function: string;
  keys: KeymapLayout;
}

function from_ix(ix: number) {
  return (layout: string[]) => layout[ix];
}
function split_spacer(n: number) {
  return (_: string[]) => " ".repeat(n);
}
function e(_: string[]) {
  return "";
}
/**
 * creates a keymap layout for a simple, straightforward keyboard.
 * Same number of columns for every row
 * @param cols number of columns on the keymap
 * @param rows number of rows on the keymap
 * @returns
 */
export function straight_keymap(cols: number, rows: number): BoardLayout {
  return Array(rows)
    .fill(null)
    .map((_, line_no) =>
      Array(cols)
        .fill(null)
        .map((_, col_no) => from_ix(line_no * cols + col_no))
    );
}

function straight_split_keymap(
  cols: number,
  rows: number,
  split_spacer_length: number
) {
  let split_column_no = Math.round(cols / 2);
  return Array(rows)
    .fill(null)
    .map((_, line_no) =>
      Array(cols + 1)
        .fill(null)
        .map((_, col_no) => {
          if (col_no < split_column_no) return from_ix(line_no * cols + col_no);
          if (col_no > split_column_no)
            return from_ix(line_no * cols + col_no - 1);
          else return split_spacer(split_spacer_length);
        })
    );
}

export class KeyboardConfiguration {
  name: string;
  keymap_layout: BoardLayout;
  via_layout?: BoardLayout;
  keymap_layout_markers: string[];
}

export const existing_layouts: KeyboardConfiguration[] = [
  {
    name: "Sofle",
    // prettier-ignore
    keymap_layout:[
        [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3)  , from_ix(4)  , from_ix(5)  , e ,             split_spacer(2),             e , from_ix(6)  , from_ix(7)  , from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11)],
        [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15) , from_ix(16) , from_ix(17) , e ,             split_spacer(2),             e , from_ix(18) , from_ix(19) , from_ix(20) , from_ix(21) , from_ix(22) , from_ix(23)],
        [from_ix(24) , from_ix(25) , from_ix(26) , from_ix(27) , from_ix(28) , from_ix(29) , e ,             split_spacer(2),             e , from_ix(30) , from_ix(31) , from_ix(32) , from_ix(33) , from_ix(34) , from_ix(35)],
        [from_ix(36) , from_ix(37) , from_ix(38) , from_ix(39) , from_ix(40) , from_ix(41) , from_ix(42) ,   split_spacer(2),   from_ix(43) , from_ix(44) , from_ix(45) , from_ix(46) , from_ix(47) , from_ix(48) , from_ix(49)],
        [e ,           e ,           from_ix(50) , from_ix(51) , from_ix(52) , from_ix(53) , from_ix(54) ,   split_spacer(2),   from_ix(55) , from_ix(56) , from_ix(57) , from_ix(58) , from_ix(59) , e ,           e, ],
     ],
    // prettier-ignore
    via_layout:[
      [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3)  , from_ix(4)  , from_ix(5)  , e ,             split_spacer(2),             e , from_ix(35) , from_ix(34) , from_ix(33) , from_ix(32) , from_ix(31) , from_ix(30)], 
      [from_ix(6)  , from_ix(7)  , from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11) , e ,             split_spacer(2),             e , from_ix(41) , from_ix(40) , from_ix(39) , from_ix(38) , from_ix(37) , from_ix(36)],
      [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15) , from_ix(16) , from_ix(17) , e ,             split_spacer(2),             e , from_ix(47) , from_ix(46) , from_ix(45) , from_ix(44) , from_ix(43) , from_ix(42)],
      [from_ix(18) , from_ix(19) , from_ix(20) , from_ix(21) , from_ix(22) , from_ix(23) , from_ix(29) ,   split_spacer(2),   from_ix(59) , from_ix(53) , from_ix(52) , from_ix(51) , from_ix(50) , from_ix(49) , from_ix(48)],
      [e ,           e ,          from_ix(24) , from_ix(25) , from_ix(26) , from_ix(27) , from_ix(28) ,    split_spacer(2),   from_ix(58) , from_ix(57) , from_ix(56) , from_ix(55) , from_ix(54) , e ,           e], 
      ],
    keymap_layout_markers: ["LAYOUT("],
  },
  {
    name: "Kyria",
    // prettier-ignore
    keymap_layout:[
        [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3)  , from_ix(4)  , from_ix(5)  , e ,           e ,           split_spacer(2),             e ,           e , from_ix(6)  , from_ix(7)  , from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11)],
        [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15) , from_ix(16) , from_ix(17) , e ,           e ,           split_spacer(2),             e ,           e , from_ix(18) , from_ix(19) , from_ix(20) , from_ix(21) , from_ix(22) , from_ix(23)],
        [from_ix(24) , from_ix(25) , from_ix(26) , from_ix(27) , from_ix(28) , from_ix(29) , from_ix(30) , from_ix(31) , split_spacer(2),   from_ix(32) , from_ix(33) , from_ix(34) , from_ix(35) , from_ix(36) , from_ix(37) , from_ix(38) , from_ix(39)],
        [e ,           e ,           e ,           from_ix(40) , from_ix(41) , from_ix(42) , from_ix(43) , from_ix(44) , split_spacer(2),   from_ix(45) , from_ix(46) , from_ix(47) , from_ix(48) , from_ix(49) , from_ix(50) , e ,           e],
     ],
    keymap_layout_markers: ["LAYOUT(", "LAYOUT_wrapper("],
  },
  {
    name: "Lily58",
    // prettier-ignore
    keymap_layout:[
        [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3)  , from_ix(4)  , from_ix(5)  , e ,             split_spacer(2),             e , from_ix(6)  , from_ix(7)  , from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11)],
        [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15) , from_ix(16) , from_ix(17) , e ,             split_spacer(2),             e , from_ix(18) , from_ix(19) , from_ix(20) , from_ix(21) , from_ix(22) , from_ix(23)],
        [from_ix(24) , from_ix(25) , from_ix(26) , from_ix(27) , from_ix(28) , from_ix(29) , e ,             split_spacer(2),             e , from_ix(30) , from_ix(31) , from_ix(32) , from_ix(33) , from_ix(34) , from_ix(35)],
        [from_ix(36) , from_ix(37) , from_ix(38) , from_ix(39) , from_ix(40) , from_ix(41) , from_ix(42) ,   split_spacer(2),   from_ix(43) , from_ix(44) , from_ix(45) , from_ix(46) , from_ix(47) , from_ix(48) , from_ix(49)],
        [e ,           e ,           e ,           from_ix(50) , from_ix(51) , from_ix(52) , from_ix(53) ,   split_spacer(2),   from_ix(54) , from_ix(55) , from_ix(56) , from_ix(57) , e ,           e ,           e, ],
     ],
    keymap_layout_markers: ["LAYOUT(", "LAYOUT_wrapper("],
  },
  {
    name: "Reviung41",
    // prettier-ignore
    keymap_layout:[
        [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3)  , from_ix(4)  , from_ix(5)  , split_spacer(2) , from_ix(6)  , from_ix(7)  , from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11)],
        [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15) , from_ix(16) , from_ix(17) , split_spacer(2) , from_ix(18) , from_ix(19) , from_ix(20) , from_ix(21) , from_ix(22) , from_ix(23)],
        [from_ix(24) , from_ix(25) , from_ix(26) , from_ix(27) , from_ix(28) , from_ix(29) , split_spacer(2) , from_ix(30) , from_ix(31) , from_ix(32) , from_ix(33) , from_ix(34) , from_ix(35)],
        [e           , e           , e           , e           , from_ix(36) , from_ix(37) , from_ix(38)     , from_ix(39) , from_ix(40) , e           , e            , e          , e]
     ],
    keymap_layout_markers: ["LAYOUT(", "LAYOUT_wrapper(", "LAYOUT_reviung41("],
  },
  {
    name: "Zodiark",
    keymap_layout: straight_keymap(14, 5),
    keymap_layout_markers: ["LAYOUT("],
  },
  {
    name: "Zodiark - Split keymap",
    keymap_layout: straight_split_keymap(14, 5, 8),
    keymap_layout_markers: ["LAYOUT("],
  },
  {
    name: "Super16",
    keymap_layout: straight_keymap(4, 4),
    keymap_layout_markers: ["LAYOUT(", "LAYOUT_ortho_4x4("],
  },
];
