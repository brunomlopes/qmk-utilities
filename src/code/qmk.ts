import { pretty_print_mappings } from "./keycodes";
import { BoardLayout, LayoutLayer } from "./layouts";
import { AllDoneException, print_ascii_keymap, print_keymaps } from "./parser";

const is_line_comment_re = /\s*\/\//;

export function* parse_layouts_from_keymap_content(
  keymap_content: string,
  layout_definition_start_marker: string[]
) {
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
      let marker = "";
      while (
        !(layoutLayer.layout_function = layout_definition_start_marker.find(
          (m) => line.includes(m)
        ))
      ) {
        line = read_line();
      }
      layoutLayer.name = line.match(/\[\s*([\w\d]+)\s*\]/)[1];
      line = read_line();
      let lines = [];
      while (line.trim() != ")," && line.trim() != "};") {
        lines.push(line);
        line = read_line();
      }
      if (lines.filter((l) => l.match(is_line_comment_re)).length > 0)
        layoutLayer.includeAsciiKeymap = true;
      layoutLayer.keys = lines
        .filter((l) => l.trim() != ")" && !l.match(is_line_comment_re))
        .map((l) => l.trim().replace(/\\$/, ""))
        .join("")
        .split(/[,](?!\s*\w+\))/)
        .map((s) => s.trim());
      yield layoutLayer;
    } catch (error) {
      let e = error as AllDoneException;
      if (!e.IsAllDone) throw error; //TODO: rethrow correctly?
      keep_reading = false;
    }
  }
}

export function print_keymaps_qmk(
  layers: LayoutLayer[],
  board_layout: BoardLayout,
  render_header_and_footer: boolean
) {
  return print_keymaps(layers, board_layout, render_header_and_footer, {
    separator: ",",
    layer_prefix_render: (indentation, layer) => {
      let ascii_keymap = "";
      if (layer.includeAsciiKeymap) {
        ascii_keymap = `\n${print_ascii_keymap_qmk(layer, board_layout)}`;
      }
      return `${indentation}[${layer.name}] = ${layer.layout_function}${ascii_keymap}`;
    },
    layer_sufix_render: (indentation, _) => `${indentation}),\n`,
    layer_line_prefix: (indentation, _) => `${indentation}${indentation}`,
  });
}

function ascii_print_key(
  key: string,
  layer: LayoutLayer,
  position: { line: number; column: number },
  layers: LayoutLayer[]
) {
  if (!key) return key;

  if (key.startsWith("KC_")) {
    let p = key.replace("KC_", "");
    if (pretty_print_mappings[p]) return pretty_print_mappings[p];

    if (p.match(/P\d/)) return p.replace("P", "#");

    return p;
  }
  const mod_regexp = /(\w+)\(([\w_]+)\)/;
  let mod_regexp_match = key.match(mod_regexp);
  if (mod_regexp_match) {
    let mod = mod_regexp_match[1];
    let shifted = mod_regexp_match[2];
    return `${mod}(${ascii_print_key(shifted, layer, position, layers)})`;
  }

  if (key.startsWith("MT(")) {
    return key
      .replace("MT(", "")
      .replace(")", "")
      .split(",")
      .map((w) =>
        ascii_print_key(w.replace("MOD_", ""), layer, position, layers)
      )
      .join("|");
  }
  if (key == "&trans") return " ";
  return key;
}

export function print_ascii_keymap_qmk(
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
