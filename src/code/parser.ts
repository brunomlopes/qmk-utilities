import { BoardLayout, LayoutLayer } from "./layouts";

export class AllDoneException {
  IsAllDone: boolean;
  constructor() {
    this.IsAllDone = true;
  }
}

let pretty_labels = {
  KC_EXLM: `!`,
  KC_HASH: `#`,
  KC_PERC: `%`,
  KC_AT: `@`,
  KC_DLR: `$`,
  KC_CIRC: `^`,
  KC_LCBR: `{`,
  KC_LPRN: `(`,
  KC_LBRC: `[`,
  KC_RCBR: `}`,
  KC_RPRN: `)`,
  KC_RBRC: `]`,
  KC_PIPE: `|`,
  KC_GRV: "` ~",
  KC_TILD: `~`,
  KC_PLUS: `+`,
  KC_AMPR: `&`,
  KC_UNDS: `_`,
  KC_MINS: `- _`,
  KC_EQL: `= +`,
  "KC_ALGR(KC_5)": `€`,
  KC_SLSH: `/ ?`,
  KC_COMM: `, >`,
  KC_ASTR: `*`,
  KC_DOT: `. <`,
  KC_BSLS: `\ |`,
  KC_QUOT: `' "`,
  KC_SCLN: `; :`,
};

type HorizontalPlacement = "left" | "center";
const indentation = "  ";
type PrintConfiguration = {
  separator: string;
  layer_prefix_render: (indentation: string, layer: LayoutLayer) => string;
  layer_sufix_render: (indentation: string, layer: LayoutLayer) => string;
  layer_line_prefix: (indentation: string, layer: LayoutLayer) => string;
  min_padding?: number;
};

export function print_keymaps(
  layers: LayoutLayer[],
  board_layout: BoardLayout,
  render_header_and_footer: boolean,
  print_configuration: PrintConfiguration
) {
  let strBuilder = "";

  function print(s: string, end = "\n") {
    strBuilder += s + end;
  }

  const min_padding = print_configuration.min_padding ?? 1;

  const matrix_shape = [
    board_layout.length,
    Math.max(...board_layout.map((line) => line.length)),
  ];

  if (render_header_and_footer)
    print("const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {");
  layers.forEach((layer, i) => {
    let matrix: string[][] = Array(matrix_shape[0])
      .fill(null)
      .map((_) => Array(matrix_shape[1]).fill(null));

    board_layout.map((line_content, line_no) => {
      line_content.map((col, col_no) => {
        let key_label = col(layer.keys);
        matrix[line_no][col_no] = key_label;
      });
    });
    print(`${print_configuration.layer_prefix_render(indentation, layer)}`);

    matrix.forEach((line, line_no) => {
      print(print_configuration.layer_line_prefix(indentation, layer), "");
      line.forEach((key, col_no) => {
        let key_lengths = matrix
          .map((l) => l[col_no])
          .map((v) => (v || "").length);

        let longest_key_definition_length =
          Math.max(...key_lengths) + min_padding;

        let right_padding = " ".repeat(
          Math.max(longest_key_definition_length - (key || "").length, 1)
        );
        let left_padding = " ";

        // first column doesn't need padding because there's already whitespace
        // at the start, with the indentation
        if (col_no == 0) left_padding = "";

        let suffix = print_configuration.separator;
        if (!key || key.trim() == "") suffix = " ";

        let last_col_with_key =
          line
            .map((c, i) => [(c || "").trim(), i])
            .filter((c) => c[0] != "" || c[1] < col_no).length - 1;
        let last_line = matrix.length - 1;
        if (line_no == last_line && col_no == last_col_with_key) suffix = "";

        print(`${left_padding}${key || ""}${right_padding}${suffix}`, "");
      });
      print("");
    });
    print(print_configuration.layer_sufix_render(indentation, layer));
  });

  if (render_header_and_footer) print("};");

  return strBuilder;
}

export function print_ascii_keymap(
  layers: LayoutLayer[],
  board_layout: BoardLayout,
  print_configuration: PrintConfiguration,
  key_replacer: (
    key: string,
    layer: LayoutLayer,
    position: { line: number; column: number },
    layers: LayoutLayer[]
  ) => string
) {
  let strBuilder = "";

  function print(s: string, end = "\n") {
    strBuilder += s + end;
  }

  const min_padding = print_configuration.min_padding ?? 1;

  const matrix_shape = [
    board_layout.length,
    Math.max(...board_layout.map((line) => line.length)),
  ];

  layers.forEach((layer, i) => {
    let matrix: string[][] = Array(matrix_shape[0])
      .fill(null)
      .map((_) => Array(matrix_shape[1]).fill(null));

    board_layout.map((line_content, line_no) => {
      line_content.map((col, col_no) => {
        let key_label = col(layer.keys);
        matrix[line_no][col_no] = key_label;
      });
    });

    matrix.forEach((line, line_no) => {
      print(print_configuration.layer_line_prefix(indentation, layer), "");
      line.forEach((key, col_no) => {
        let key_to_render = key_replacer(
          key,
          layer,
          {
            line: line_no,
            column: col_no,
          },
          layers
        );

        let key_lengths = matrix
          .map((l, l_no): [string, number] => [l[col_no], l_no])
          .map((pair) => {
            let [v, l_no] = pair;
            let replaced_v = key_replacer(
              v,
              layer,
              {
                line: l_no,
                column: col_no,
              },
              layers
            );
            return (replaced_v || "").length;
          });

        let longest_key_definition_length =
          Math.max(...key_lengths) + min_padding;

        longest_key_definition_length += 1;

        let left_padding = " ".repeat(
          Math.max(
            Math.floor(
              (longest_key_definition_length - key_to_render.length) / 2
            ),
            0
          )
        );
        let right_padding = " ".repeat(
          Math.max(
            longest_key_definition_length -
              (left_padding + key_to_render).length,
            1
          )
        );

        let suffix = "";
        let prefix = "|";
        if (!key) suffix = " ";
        // if (key != null && col_no == line.length - 1) suffix = "|";
        if (!key) prefix = "";

        let last_col_with_key =
          line
            .map((c, i) => [(c || "").trim(), i])
            .filter((c) => c[0] != "" || c[1] < col_no).length - 1;
        if (col_no == last_col_with_key) suffix = "|";

        print(
          `${prefix}${left_padding}${
            key_to_render || ""
          }${right_padding}${suffix}`,
          ""
        );
      });
      print("");
    });
  });

  return strBuilder;
}
