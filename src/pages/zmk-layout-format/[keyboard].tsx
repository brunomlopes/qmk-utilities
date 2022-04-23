import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";
import styles from "./index.module.css";
import React, { Component } from "react";

import { useRouter } from "next/router";
import { debug } from "console";
import {
  BoardLayout,
  existing_layouts,
  KeyboardConfiguration,
  KeymapLayout,
} from "common/layouts";

const sample_reviung_keymap = `
keymap {
  compatible = "zmk,keymap";

  default_layer {
// -------------------------------------------------------------------------------------
// |  TAB |  Q  |  W  |  E  |  R  |  T  |   |  Y  |  U   |  I  |  O  |  P  |   BKSP    |
// | CTRL |  A  |  S  |  D  |  F  |  G  |   |  H  |  J   |  K  |  L  |  ;  |    '      |
// | SHFT |  Z  |  X  |  C  |  V  |  B  |   |  N  |  M   |  ,  |  .  |  /  | SHFT(RET) |
//                         | ALT | LWR | SPC | RSE  | ALT |
          bindings = <
&mt LALT ESC &kp Q &kp W &kp E &kp R &kp T   &kp Y &kp U  &kp I     &kp O   &kp P    &mt LALT RBRC
&mt LCTRL TAB &kp A &kp S &kp D &kp F &kp G   &kp H &kp J  &kp K     &kp L   &kp RET  &mt RCTL BSPC
&kp LSHFT &kp Z &kp X &kp C &kp V &kp B   &kp N &kp M  &kp COMMA &kp DOT &kp FSLH &mt RSHFT RET
          &kp LALT  &mo 1 &kp SPACE &mo 2  &kp RALT
          >;
  };       

  lower_layer {
// ----------------------------------------------------------------------------------
// |    |  !  |  @  |  #  |  $  |  %  |   |  ^  |  &  |  *  |  (  |  )  |    DEL    |
// |    |  _  |  +  |  {  |  }  | "|" |   | LFT | DWN |  UP | RGT |  \`  |     ~     |
// |    | ESC | GUI | ALT | CAPS|  "  |   | HOME| END | PGUP| PGDN| PRSC| SHFT(RET) |
//                       |     |     | RET | ADJ |     |
          bindings = <
&trans &kp EXCL  &kp AT      &kp HASH &kp DLLR &kp PRCNT      &kp CARET &kp AMPS &kp N8    &kp LPAR  &kp RPAR  &kp DEL
&trans &kp MINUS &kp KP_PLUS &kp LBRC &kp RBRC &kp PIPE       &kp LEFT  &kp DOWN &kp UP    &kp RIGHT &kp GRAVE &kp TILDE
&trans &kp ESC   &kp LGUI    &kp LALT &kp CLCK &kp DQT        &kp HOME  &kp END  &kp PG_UP &kp PG_DN &kp PSCRN &mt RSHFT RET
                   &trans      &trans       &kp RET        &mo 3       &trans
          >;
  };

  raise_layer {
// -----------------------------------------------------------------------------------------
// |    |  1  |  2  |  3  |  4  |  5  |   |  6  |  7  |  8  |  9  |  0  | DEL |
// |    |  -  |  =  |  [  |  ]  |  \  |   | F1  | F2  | F3  | F4  | F5  | F6  |
// |    | ESC | GUI | ALT | CAPS|  "  |   | F7  | F8  | F9  | F10 | F11 | F12 |
//                       |     | ADJ | BKSP |    |     |
          bindings = <
&trans &kp N1    &kp N2    &kp N3    &kp N4    &kp N5        &kp N6    &kp N7    &kp N8    &kp N9    &kp N0    &kp DEL
&trans &kp MINUS &kp EQUAL &kp LBKT  &kp RBKT  &kp BSLH      &kp F1    &kp F2    &kp F3    &kp F4    &kp F5    &kp F6
&trans &kp ESC   &kp LGUI  &kp RALT  &kp CLCK  &kp DQT       &kp F7    &kp F8    &kp F9    &kp F10   &kp F11   &kp F12
                  &trans      &mo 3       &kp BSPC        &trans      &trans
          >;
  };

  adjust_layer {
// -----------------------------------------------------------------------------------------
// | RGB BRI+ | RGB SAT+ | RGB HUE+ | RGB ANI+ |    | RGB TOG |   |  BT1  | BT2 | BT3 | BT4 | BT5 | BT CLR |
// | RGB BRI- | RGB SAT- | RGB HUE- | RGB ANI- |    |         |   |       |     |     |     |     |        |
// |          |          |          |          |    |         |   | RESET |     |     |     |     |        |
//                                              |     |     |     |     |     |
          bindings = <
&rgb_ug RGB_BRI &rgb_ug RGB_SAI &rgb_ug RGB_HUI &rgb_ug RGB_EFF &none &rgb_ug RGB_TOG    &bt BT_SEL 0 &bt BT_SEL 1 &bt BT_SEL 2 &bt BT_SEL 3 &bt BT_SEL 4 &bt BT_CLR
&rgb_ug RGB_BRD &rgb_ug RGB_SAD &rgb_ug RGB_HUD &rgb_ug RGB_EFR &none &none              &none        &none        &none        &none        &none        &none
&none           &none           &none           &none           &none &none              &reset       &none        &none        &none        &none        &none
                                               &trans      &trans       &tog 3        &trans      &trans
          >;
  };
};
  `;

let pretty_labels = {};

class AllDoneException {
  IsAllDone: boolean;
  constructor() {
    this.IsAllDone = true;
  }
}
class LayoutLayer {
  name: string;
  layout_function: string;
  keys: KeymapLayout;
}
function* parse_layouts_from_keymap_content(keymap_content: string) {
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

function pretty_labels_replacements(key_label: string) {
  if (pretty_labels[key_label]) return pretty_labels[key_label];

  return key_label.replace("KC_", "");
}

let run_replacements = keymap_code_replacements;

let base_indentation_level = 0;
let indentation = "  ";
function print_keymaps(
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

interface LayoutFormatState {
  input_keymap_content: string;
  formatted_keymap_content: string;
  selected_keyboard: KeyboardConfiguration;
}
interface LayoutFormatProps {
  keyboard?: string;
  pushKeyboard: (keyboardName: string) => void;
}
class LayoutFormatComponent extends Component<
  LayoutFormatProps,
  LayoutFormatState
> {
  private _pushKeyboard: (keyboardName: string) => void;
  constructor(props: LayoutFormatProps) {
    super(props);
    let selected_keyboard = existing_layouts[0];
    if (props.keyboard)
      selected_keyboard =
        existing_layouts.find((k) => k.name == props.keyboard) ??
        existing_layouts[0];

    this._pushKeyboard = props.pushKeyboard;

    this.state = {
      input_keymap_content: "",
      formatted_keymap_content: "",
      selected_keyboard: selected_keyboard,
    };

    this.onKeymapInputChange = this.onKeymapInputChange.bind(this);
    this.onKeyboardSelection = this.onKeyboardSelection.bind(this);
    this.loadSampleKeymap = this.loadSampleKeymap.bind(this);
  }

  onKeymapInputChange(changeEvent: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = changeEvent.target.value;

    this.setState({
      input_keymap_content: newValue,
    });
    this.parseInputKeymap(newValue, this.state.selected_keyboard);
  }
  onKeyboardSelection(changeEvent: React.ChangeEvent<HTMLSelectElement>) {
    let selected_keyboard = existing_layouts.find(
      (l) => l.name == changeEvent.target.value
    );
    this._pushKeyboard(selected_keyboard.name);
    this.setState({
      selected_keyboard: selected_keyboard,
    });
    this.parseInputKeymap(this.state.input_keymap_content, selected_keyboard);
  }
  parseInputKeymap(newValue: string, selected_keyboard: KeyboardConfiguration) {
    let layouts: LayoutLayer[] = [];

    let render_header_and_footer = false;

    if (newValue.toLowerCase().indexOf("progmem") != -1)
      render_header_and_footer = true;

    for (let layout of parse_layouts_from_keymap_content(newValue)) {
      layouts.push(layout);
    }

    let newLayouts = print_keymaps(
      layouts,
      selected_keyboard.keymap_layout,
      render_header_and_footer
    );
    this.setState({
      formatted_keymap_content: newLayouts,
    });
  }

  loadSampleKeymap() {
    this.setState({
      input_keymap_content: sample_reviung_keymap,
    });
    this.parseInputKeymap(sample_reviung_keymap, this.state.selected_keyboard);
  }

  render() {
    return (
      <Layout home="false">
        <Head>
          <title>Layout formatter</title>
        </Head>
        <h1>Formats zmk layouts</h1>
        <div>
          <label htmlFor="keyboard">Select a keyboard:</label>

          <select
            name="keyboard"
            id="keyboard"
            defaultValue={this.state.selected_keyboard.name}
            onChange={this.onKeyboardSelection}
          >
            {existing_layouts.map((configuration) => (
              <option value={configuration.name} key={configuration.name}>
                {configuration.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="keymap_input">
            Paste your keymap.c contents here:
          </label>

          <div>
            <textarea
              name="keymap_input"
              id="keymap_input"
              cols={30}
              rows={10}
              className={styles.input_textarea}
              value={this.state.input_keymap_content}
              onChange={this.onKeymapInputChange}
            ></textarea>
          </div>
          <button onClick={this.loadSampleKeymap}>
            Load sample reviung keymap
          </button>
        </div>
        <h3>Here are the formatted layouts:</h3>
        <div>
          <textarea
            name="formatted_keymap_output"
            id="formatted_keymap_output"
            readOnly={true}
            defaultValue={this.state.formatted_keymap_content}
            className={styles.output_textarea}
          ></textarea>
        </div>
        <h2>
          <Link href="/">
            <a>Back home</a>
          </Link>
        </h2>
      </Layout>
    );
  }
}

const WrappedLayoutFormatComponent = (params) => {
  const router = useRouter();
  const { keyboard } = router.query;
  let pushKeyboard = (name: string) => {
    router.push(name, name, { scroll: false, shallow: true });
  };
  return (
    <LayoutFormatComponent
      keyboard={(keyboard ?? "").toString()}
      pushKeyboard={pushKeyboard}
    ></LayoutFormatComponent>
  );
};

export default WrappedLayoutFormatComponent;

export async function getServerSideProps(ctx) {
  const { keyboard } = ctx.query;
  return {
    props: {
      keyboard,
    },
  };
}
