import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";
import styles from "./index.module.css";
import React, { Component } from "react";

function from_ix(ix: number) {
  return (layout: string[]) => layout[ix];
}
function split_spacer(n: number) {
  return (_: string[]) => " ".repeat(n);
}
function e(_: string[]) {
  return "";
}

const sample_sofle_keymap = `
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
  [_BASE] = LAYOUT(
      KC_GRV              , KC_1 , KC_2    , KC_3    , KC_4    , KC_5              ,                                           KC_6        , KC_7    , KC_8    , KC_9    , KC_0    , KC_MINS ,
      KC_ESC              , KC_Q , KC_W    , KC_E    , KC_R    , KC_T              ,                                           KC_Y        , KC_U    , KC_I    , KC_O    , KC_P    , KC_RBRC ,
      MT(MOD_LSFT,KC_TAB) , KC_A , KC_S    , KC_D    , KC_F    , KC_G              ,                                           KC_H        , KC_J    , KC_K    , KC_L    , KC_BSLS , KC_BSPC ,
      KC_LSFT             , KC_Z , KC_X    , KC_C    , KC_V    , KC_B              , KC_MS_BTN1         ,    KC_MUTE         , KC_N        , KC_M    , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                                  KC_LCTL , KC_LALT , KC_LGUI , LT(_LOWER,KC_SPC) , LT(_SYMBOL,KC_ENT) ,    LT(_NAV,KC_SPC) , MO(_SYMBOL) , KC_RCTL , KC_RGUI , KC_RALT
  ),
  [_COLEMAK] = LAYOUT(
      KC_GRV  , KC_1 , KC_2    , KC_3    , KC_4    , KC_5    ,                       KC_6    , KC_7    , KC_8    , KC_9    , KC_0    , KC_GRV  ,
      KC_ESC  , KC_Q , KC_W    , KC_F    , KC_P    , KC_G    ,                       KC_J    , KC_L    , KC_U    , KC_Y    , KC_SCLN , KC_BSPC ,
      KC_TAB  , KC_A , KC_R    , KC_S    , KC_T    , KC_D    ,                       KC_H    , KC_N    , KC_E    , KC_I    , KC_O    , KC_QUOT ,
      KC_LSFT , KC_Z , KC_X    , KC_C    , KC_V    , KC_B    , KC_MUTE ,    KC_NO  , KC_K    , KC_M    , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                      KC_LGUI , KC_LALT , KC_LCTL , _______ , KC_ENT  ,    KC_SPC , _______ , KC_RCTL , KC_RALT , KC_RGUI
  ),
  [_LOWER] = LAYOUT(
      KC_DEL  , KC_F1   , KC_F2   , KC_F3   , KC_F4   , KC_F5   ,                        KC_F6       , KC_F7   , KC_F8      , KC_F9   , KC_F10  , KC_F11  ,
      KC_GRV  , KC_1    , KC_2    , KC_3    , KC_4    , KC_5    ,                        KC_6        , KC_7    , KC_8       , KC_9    , KC_0    , KC_F12  ,
      KC_TILD , KC_EXLM , KC_AT   , KC_HASH , KC_DLR  , KC_PERC ,                        KC_CIRC     , KC_AMPR , KC_ASTR    , KC_LPRN , KC_RPRN , KC_PIPE ,
      _______ , KC_UNDS , KC_MINS , KC_NO   , KC_LCBR , KC_LBRC , _______ ,    _______ , KC_NUBS     , KC_RPRN , S(KC_NUBS) , KC_NO   , KC_NO   , _______ ,
                          _______ , _______ , _______ , _______ , _______ ,    _______ , TT(_NUMPAD) , _______ , _______    , _______
  ),
  [_NAV] = LAYOUT(
      KC_NO   , KC_NO   , KC_NO   , KC_NO   , A(KC_F4)        , KC_NO   ,                        KC_NO   , KC_NO      , C(KC_UP)   , KC_NO      , KC_NO     , A(KC_F4)   ,
      _______ , KC_INS  , KC_PSCR , KC_PAUS , A(ALGR(KC_TAB)) , KC_NO   ,                        KC_PGUP , KC_HOME    , KC_UP      , KC_END     , C(KC_DEL) , C(KC_BSPC) ,
      _______ , KC_LALT , KC_LCTL , KC_LSFT , KC_NO           , KC_CAPS ,                        KC_PGDN , KC_LEFT    , KC_DOWN    , KC_RGHT    , KC_DEL    , KC_BSPC    ,
      _______ , C(KC_Z) , C(KC_X) , C(KC_C) , C(KC_V)         , KC_INS  , _______ ,    _______ , KC_NO   , C(KC_LEFT) , C(KC_DOWN) , C(KC_RGHT) , KC_NO     , _______    ,
                          _______ , _______ , _______         , _______ , _______ ,    _______ , KC_ENT  , _______    , _______    , _______
  ),
  [_SYMBOL] = LAYOUT(
      A(KC_F4) , KC_F13        , KC_F14        , KC_F15        , KC_F16        , KC_NO         ,                    KC_NO         , KC_MPRV       , KC_MPLY , KC_MNXT , KC_MINS , KC_EQL  ,
      KC_TAB   , KC_F17        , KC_F18        , A(ALGR(KC_E)) , KC_ASTR       , KC_ASTR       ,                    KC_LPRN       , KC_LPRN       , KC_NO   , KC_BML_GRAVE , KC_LBRC , KC_RBRC ,
      KC_NO    , A(ALGR(KC_2)) , KC_AT         , KC_COLN       , A(ALGR(KC_7)) , A(ALGR(KC_8)) ,                    A(ALGR(KC_9)) , A(ALGR(KC_0)) , KC_ASTR , KC_LPRN , KC_QUOT , KC_BSLS ,
      KC_LSFT  , KC_NUBS       , KC_BML_ATILDE , KC_SCLN       , KC_BML_OTILDE , KC_NUBS       , KC_NO ,    KC_NO , S(KC_NUBS)    , KC_RPRN       , KC_COMM , KC_DOT  , KC_SLSH , KC_RSFT ,
                                _______       , _______       , _______       , TT(_NUMPAD)   , KC_NO ,    KC_NO , KC_NO         , _______       , _______ , _______
  ),
  [_NUMPAD] = LAYOUT(
      KC_BSPC , KC_UP   , KC_P7   , KC_P8   , KC_P9   , KC_PSLS     ,                        TG(_NUMPAD) , ROTARY_MODE_LEFT , ROTARY_MODE_RIGHT , KC_NO   , KC_NO  , KC_NLCK ,
      KC_LEFT , KC_RGHT , KC_P4   , KC_P5   , KC_P6   , KC_PAST     ,                        KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_NO  , KC_NO   ,
      KC_DEL  , KC_DOWN , KC_P1   , KC_P2   , KC_P3   , KC_PMNS     ,                        KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_DEL , KC_BSPC ,
      KC_NO   , KC_COMM , KC_P0   , KC_PDOT , KC_PENT , KC_PPLS     , KC_NO   ,    KC_NO   , KC_NO       , KC_NO         , KC_NO                    , KC_NO   , KC_NO  , KC_NO   ,
                          _______ , _______ , _______ , TT(_NUMPAD) , _______ ,    _______ , _______     , _______       , _______                  , _______
  ),
  };
  `;

type KeymapLayout = string[];

type BoardLayout = Array<Array<(layout: KeymapLayout) => string>>;

class KeyboardConfiguration {
  name: string;
  keymap_layout: BoardLayout;
  via_layout?: BoardLayout;
  keymap_layout_markers: string[];
}

const existing_layouts: KeyboardConfiguration[] = [
  {
    name: "Sofle v1",
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
    name: "Super16",
    // prettier-ignore
    keymap_layout:[
      [from_ix(0)  , from_ix(1)  , from_ix(2)  , from_ix(3) ],
      [from_ix(4)  , from_ix(5)  , from_ix(6)  , from_ix(7) ],
      [from_ix(8)  , from_ix(9)  , from_ix(10) , from_ix(11)],
      [from_ix(12) , from_ix(13) , from_ix(14) , from_ix(15)]
    ],
    keymap_layout_markers: ["LAYOUT(", "LAYOUT_ortho_4x4"],
  },
];

class AllDoneException {
  IsAllDone: boolean;
  constructor() {
    this.IsAllDone = true;
  }
}
class LayoutLayer {
  name: string;
  keys: KeymapLayout;
}
function* parse_layouts_from_keymap_content(
  keymap_content: string,
  layout_definition_start_marker
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
      while (
        layout_definition_start_marker.filter((m) => line.includes(m)).length ==
        0
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
        .split(/[,](?!\w+\))/)
        .map((s) => s.trim());
      yield layoutLayer;
    } catch (error) {
      let e = error as AllDoneException;
      if (!e.IsAllDone) throw error; //TODO: rethrow correctly?
      keep_reading = false;
    }
  }
}

const sofle_layer_names = [
  "_BASE",
  "_COLEMAK",
  "_LOWER",
  "_NAV",
  "_SYMBOL",
  "_NUMPAD",
];
const layer_names = sofle_layer_names;

function run_replacements(key_label: string) {
  return key_label;
}

let base_indentation_level = 0;
let indentation = "  ";
function print_keymaps(layers: LayoutLayer[], board_layout: BoardLayout) {
  let strBuilder = "";

  function print(s: string, end = "\n") {
    strBuilder += s + end;
  }

  // print("enum layers {");
  // layer_names.forEach((n) => print(`\t${n},`));
  // print("};\n\n");

  const min_padding = 1;

  const matrix_shape = [
    board_layout.length,
    Math.max(...board_layout.map((line) => line.length)),
  ];

  print("const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {");
  layers.forEach((layer, i) => {
    let matrix: string[][] = Array(matrix_shape[0])
      .fill(null)
      .map((_) => Array(matrix_shape[1]).fill(null));

    board_layout.map((line_content, line_no) => {
      line_content.map((col, col_no) => {
        let key_label = col(layer.keys).trim();
        key_label = run_replacements(key_label);
        matrix[line_no][col_no] = key_label;
      });
    });
    print(`${indentation}[${layer.name}] = LAYOUT(`);

    matrix.forEach((line, line_no) => {
      print(`${indentation}${indentation}`, "");
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
        if(col_no == 0) left_padding="";

        let suffix = ",";
        if (!key || key.trim() == "") suffix = " ";

        let last_col_with_key =
          line
            .map((c, i) => [c.trim(), i])
            .filter((c) => c[0] != "" || c[1] < col_no).length - 1;
        let last_line = matrix.length - 1;
        if (line_no == last_line && col_no == last_col_with_key) suffix = "";


        print(`${left_padding}${key || ""}${right_padding}${suffix}`, "");
      });
      print("");
    });
    print(`${indentation}),`);
  });

  print("};");

  return strBuilder;
}

interface LayoutFormatState {
  input_keymap_content: string;
  formatted_keymap_content: string;
  selected_keyboard: KeyboardConfiguration;
}
interface LayoutFormatProps {}
class LayoutFormatComponent extends Component<
  LayoutFormatProps,
  LayoutFormatState
> {
  constructor(props: LayoutFormatProps) {
    super(props);
    this.state = {
      input_keymap_content: "",
      formatted_keymap_content: "",
      selected_keyboard: existing_layouts[0],
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
    this.parseInputKeymap(newValue);
  }
  onKeyboardSelection(changeEvent: React.ChangeEvent<HTMLSelectElement>) {
    let selected_keyboard = existing_layouts.find(
      (l) => l.name == changeEvent.target.value
    );
    this.setState({
      selected_keyboard: selected_keyboard,
    });
  }
  parseInputKeymap(newValue: string) {
    let layouts: LayoutLayer[] = [];

    for (let layout of parse_layouts_from_keymap_content(
      newValue,
      this.state.selected_keyboard.keymap_layout_markers
    )) {
      layouts.push(layout);
    }

    let newLayouts = print_keymaps(
      layouts,
      this.state.selected_keyboard.keymap_layout
    );
    this.setState({
      formatted_keymap_content: newLayouts,
    });
  }

  loadSampleKeymap() {
    this.setState({
      input_keymap_content: sample_sofle_keymap,
    });
    this.parseInputKeymap(sample_sofle_keymap);
  }

  render() {
    return (
      <Layout home="false">
        <Head>
          <title>Layout formatter</title>
        </Head>
        <h1>Formatter</h1>

        <button onClick={this.loadSampleKeymap}>Sample</button>
        <select
          name="keyboard"
          id="keyboard"
          onChange={this.onKeyboardSelection}
        >
          {existing_layouts.map((configuration) => (
            <option value={configuration.name}>{configuration.name}</option>
          ))}
        </select>
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
        <div>
          <textarea
            name="formatted_keymap_output"
            id="formatted_keymap_output"
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

export default LayoutFormatComponent;
