import { BoardLayout, LayoutLayer } from "./layouts";
import { AllDoneException, print_ascii_keymap, print_keymaps } from "./parser";

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
      layoutLayer.keys = lines
        .filter((l) => l.trim() != ")")
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
    layer_prefix_render: (indentation, layer) =>
      `${indentation}[${layer.name}] = ${layer.layout_function}`,
    layer_sufix_render: (indentation, _) => `${indentation}),\n`,
    layer_line_prefix: (indentation, _) => `${indentation}${indentation}`,
  });
}

const pretty_print_mappings = {
  EXCLAMATION: "!",
  EXCL: "!",
  AT_SIGN: "@",
  AT: "@",
  HASH: "#",
  POUND: "#",
  DOLLAR: "$",
  DLLR: "$",
  PERCENT: "%",
  PRCNT: "%",
  CARET: "^",
  AMPERSAND: "&",
  AMPS: "&",
  ASTERISK: "*",
  ASTRK: "*",
  STAR: "*",
  LEFT_PARENTHESIS: "(",
  LPAR: "(",
  RIGHT_PARENTHESIS: ")",
  RPAR: ")",
  MINUS: "-",
  PLUS: "+",
  EQUAL: "=",
  LBKT: "[",
  RBKT: "]",
  LBRC: "{",
  RBRC: "}",
  PIPE: "|",
  KP_PLUS: "#+",
  TILDE: "~",
  COMMA: ",",
  DOT: ".",
  BSLH: "\\",
  RET: "⮠ ",
  LGUI: "GUI",
  RGUI: "GUI",
  LALT: "ALT",
  RALT: "ALT",
  DQT: '"',
  CLCK: "CAPS",
  LEFT: "<-",
  RIGHT: "->",
  UP: "^",
  DOWN: "v",

  MINS: "-",
  TILD: "~",
  COMM: ",",
  LPRN: "(",
  RPRN: ")",
  AMPR: "&",
  EXLM: "!",
  UNDS: "_",
};

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
    return p;
  }

  if (key.startsWith("&mo ")) {
    return key.replace("&mo", "[m]");
  }
  if (key.startsWith("&tog")) {
    return key.replace("&tog", "[t]");
  }
  if (key.startsWith("&rgb_ug")) {
    return key.replace("&rgb_ug", "rgb").replace("RGB_", "");
  }
  if (key.startsWith("&bt")) {
    return key.replace("&bt", "bt").replace("BT_", "");
  }
  if (key == "&none") return "[X]";
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
    false,
    {
      separator: "|",
      layer_prefix_render: (indentation, layer) => ``,
      layer_sufix_render: (indentation, layer) => `\n`,
      layer_line_prefix: (indentation, _) => `${indentation}${indentation}// `,
    },
    ascii_print_key
  );
}
