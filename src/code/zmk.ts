import { BoardLayout, LayoutLayer } from "./layouts";
import { AllDoneException } from "./parser";

export function* parse_layouts_from_keymap_content(keymap_content: string) {
  const content_reader = (function* () {
    let split_content = keymap_content.split("\n");
    for (let i = 0; i < split_content.length; i++) {
      yield split_content[i];
    }
  })();

  const read_line = () => {
    let nextValue = content_reader.next();
    if (nextValue.done) throw new AllDoneException();
    return nextValue.value as string;
  };
  let keep_reading = true;
  while (keep_reading) {
    try {
      let layoutLayer = new LayoutLayer();

      let line = read_line();
      let layout_match = null;
      while (
        line.trim().startsWith("keymap {") ||
        !(layout_match = line.match(/\s*([\w\d]+)\s*\{/))
      ) {
        line = read_line();
      }
      layoutLayer.name = layout_match[1];
      line = read_line();
      let lines = [];
      while (line.trim() != "};") {
        lines.push(line);
        line = read_line();
      }
      layoutLayer.keys = lines
        .map((l) => l.trim())
        .filter(
          (l) =>
            l != ")" &&
            !l.startsWith("bindings = ") &&
            !l.startsWith(">;") &&
            !l.startsWith("//")
        )
        .join("")
        .split(/[&]/)
        .filter((k) => k.trim() != "")
        .map((s) => "&" + s.trim());
      yield layoutLayer;
    } catch (error) {
      let e = error as AllDoneException;
      if (!e.IsAllDone) throw error; //TODO: rethrow correctly?
      keep_reading = false;
    }
  }
}

function keymap_code_replacements(key_label: string) {
  return key_label;
}

let run_replacements = keymap_code_replacements;

const indentation = "  ";
export function print_keymaps(
  layers: LayoutLayer[],
  board_layout: BoardLayout,
  render_header_and_footer: boolean
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

  if (render_header_and_footer) print("keymap {");
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
    print(`${indentation}${layer.name} {`);
    print(`${indentation}${indentation}bindings = <`);

    matrix.forEach((line, line_no) => {
      print(`${indentation}${indentation}${indentation}`, "");
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

        let suffix = " ";
        if (!key || key.trim() == "") suffix = " ";

        let last_col_with_key =
          line
            .map((c, i) => [(c || "").trim(), i])
            .filter((c) => c[0] != "" || c[1] < col_no).length - 1;
        let last_line = matrix.length - 1;
        if (line_no == last_line && col_no == last_col_with_key) suffix = "";

        print(`${left_padding}${key || ""}${right_padding}${suffix}`, "");
      });
      print(``);
    });
    print(`${indentation}${indentation}>;`);
    print(`${indentation}};\n`);
  });

  if (render_header_and_footer) print("};");

  return strBuilder;
}
