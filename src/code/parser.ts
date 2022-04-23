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

function keymap_code_replacements(key_label: string) {
  return key_label;
}

function pretty_labels_replacements(key_label: string) {
  if (pretty_labels[key_label]) return pretty_labels[key_label];

  return key_label.replace("KC_", "");
}

let run_replacements = keymap_code_replacements;

const indentation = "  ";
type PrintConfiguration = {
  separator: string;
  layer_prefix_render: (indentation: string, layer: LayoutLayer) => string;
  layer_sufix_render: (indentation: string, layer: LayoutLayer) => string;
  layer_line_prefix: (indentation: string, layer: LayoutLayer) => string;
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

  const min_padding = 1;

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
        key_label = run_replacements(key_label);
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

        const longest_key_definition_length =
          Math.max(...key_lengths) + min_padding;

        let right_padding = " ".repeat(
          longest_key_definition_length - (key || "").length
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
