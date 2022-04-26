import { pretty_print_mappings } from "./keycodes";
import { BoardLayout, LayoutLayer } from "./layouts";
import { AllDoneException, print_ascii_keymap, print_keymaps } from "./parser";

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
      if (lines.filter((l) => l.match(/\s*\/\//)).length > 0)
        layoutLayer.includeAsciiKeymap = true;

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
export function print_keymaps_zmk(
  layers: LayoutLayer[],
  board_layout: BoardLayout,
  render_header_and_footer: boolean
) {
  return print_keymaps(layers, board_layout, render_header_and_footer, {
    separator: " ",
    layer_prefix_render: (indentation, layer) => {
      let ascii_keymap = "";
      if (layer.includeAsciiKeymap) {
        ascii_keymap = print_ascii_keymap_zmk(layer, board_layout) + "\n";
      }
      return `${indentation}${layer.name} {\n${ascii_keymap}${indentation}${indentation}bindings = <`;
    },
    layer_sufix_render: (indentation, layer) =>
      `${indentation}${indentation}>;\n${indentation}};\n`,
    layer_line_prefix: (indentation, _) =>
      `${indentation}${indentation}${indentation}`,
  });
}

function ascii_print_key(
  key: string,
  layer: LayoutLayer,
  position: { line: number; column: number },
  layers: LayoutLayer[]
) {
  if (!key) return key;
  if (key.startsWith("&kp ")) {
    let p = key.replace("&kp ", "");
    if (p.match(/N\d$/)) return p.replace("N", "");
    if (pretty_print_mappings[p]) return pretty_print_mappings[p];
    return p;
  }
  if (key.startsWith("&mo ")) {
    return key.replace("&mo", "[m]");
  }
  if (key.startsWith("&tog")) {
    return key.replace("&tog", "[t]");
  }
  if (key.startsWith("&rgb_ug")) {
    key = key.replace("&rgb_ug", "rgb").replace("RGB_", "");
    key = key.replace(/I$/, "+").replace(/D$/, "-");
    key = key.replace(/F$/, "+").replace(/R$/, "-");
    key = key
      .replace("BR", "BRI")
      .replace("SA", "SAT")
      .replace("HU", "HUE")
      .replace("EF", "ANI");
    return key;
  }
  if (key.startsWith("&bt")) {
    return key.replace("&bt", "bt").replace("BT_", "");
  }
  if (key == "&none") return "[X]";
  if (key.startsWith("&mt")) {
    return key
      .replace("&mt ", "")
      .split(" ")
      .map((w) => ascii_print_key(w, layer, position, layers))
      .join("|");
  }
  if (key == "&trans") return " ";
  return key;
}

export function print_ascii_keymap_zmk(
  layers: LayoutLayer,
  board_layout: BoardLayout
) {
  return print_ascii_keymap(
    [layers],
    board_layout,
    {
      separator: "|",
      layer_prefix_render: (indentation, layer) => ``,
      layer_sufix_render: (indentation, layer) => `\n`,
      layer_line_prefix: (indentation, _) => `${indentation}${indentation}// `,
    },
    ascii_print_key
  );
}
