/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => OneRingPlugin
});
var import_obsidian2 = __toModule(require("obsidian"));

// statblockrenderer.ts
var import_obsidian = __toModule(require("obsidian"));
var StatblockRenderer = class extends import_obsidian.MarkdownRenderChild {
  constructor(containerEl, context, params) {
    super(containerEl);
    this.params = params;
    __publicField(this, "statblockEl");
    this.statblockEl = this.containerEl.createDiv({ cls: "statblock-tor2e" });
    this.statblockEl.createEl("h2", { cls: "nomargin em", text: params.name });
    if (params.blurb !== void 0 || params.description !== void 0) {
      import_obsidian.MarkdownRenderer.renderMarkdown(params.blurb || params.description, this.statblockEl, context, this);
    }
    const topSectionEl = this.statblockEl.createEl("section", { cls: "maxw" });
    const attributeEl = topSectionEl.createDiv({ cls: "fl-r lg" });
    diamond(attributeEl, "Attribute Level", params.level);
    topSectionEl.createDiv({ cls: "caps bold nomargin", text: params.name });
    if (params.features !== void 0) {
      import_obsidian.MarkdownRenderer.renderMarkdown(params.features.join(", "), topSectionEl, context, this);
    }
    const statsEl = this.statblockEl.createEl("section", { cls: "clear" });
    diamond(statsEl, "Endurance", params.endurance);
    diamond(statsEl, "Might", params.might);
    if (params.resolve !== void 0) {
      diamond(statsEl, "Resolve", params.resolve);
    } else {
      diamond(statsEl, "Hate", params.hate);
    }
    if (params.parry !== void 0) {
      diamond(statsEl, "Parry", bonus(params.parry));
    } else {
      diamond(statsEl, "Parry", "\u2013");
    }
    if (params.armour !== void 0) {
      diamond(statsEl, "Armour", params.armour);
    } else {
      diamond(statsEl, "Armour", params.armor);
    }
    if (params.proficiencies) {
      const profsEl = this.statblockEl.createEl("section", { cls: "clear" });
      profsEl.createEl("p", { cls: "caps bold nomargin", text: "Combat Proficiencies" });
      for (let i = 0; i < params.proficiencies.length; i++) {
        const prof = params.proficiencies[i];
        const profSpecial = prof.special ? `, ${prof.special}` : "";
        const profStr = `${prof.name} ${prof.rating} (${prof.damage}/${prof.injury}${profSpecial})`;
        import_obsidian.MarkdownRenderer.renderMarkdown(profStr, profsEl, context, this);
      }
    }
    if (params.abilities) {
      const abilitiesEl = this.statblockEl.createEl("section", { cls: "clear" });
      abilitiesEl.createEl("p", { cls: "caps bold nomargin", text: "Fell Abilities" });
      for (let i = 0; i < params.abilities.length; i++) {
        import_obsidian.MarkdownRenderer.renderMarkdown(params.abilities[i], abilitiesEl, context, this);
      }
    }
  }
};
function bonus(stat) {
  if (stat === 0)
    return stat.toString();
  return stat > 0 ? `+${stat}` : `${stat}`;
}
function diamond(containerEl, label, text) {
  const diamondContainerEl = containerEl.createDiv({ cls: "attr-diamond-container" });
  diamondContainerEl.createDiv({ cls: "sc accent bold attr-diamond-label", text: label });
  const diamond2 = diamondContainerEl.createDiv({ cls: "attr-diamond" });
  let diamondText = text;
  let classes = "attr-diamond-text bold accent";
  if (diamondText === void 0) {
    diamondText = "\u2013";
  }
  if (diamondText == "\u2013") {
    classes += " lifted";
  }
  return diamond2.createDiv({ cls: classes, text: diamondText });
}

// main.ts
var OneRingPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      this.registerMarkdownCodeBlockProcessor("tor2e", this.processMarkdown.bind(this));
    });
  }
  processMarkdown(source, el, ctx) {
    return __async(this, null, function* () {
      const yaml = (0, import_obsidian2.parseYaml)(source);
      let renderData = __spreadValues({}, yaml);
      ctx.addChild(new StatblockRenderer(el, ctx.sourcePath, renderData));
    });
  }
  onunload() {
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzdGF0YmxvY2tyZW5kZXJlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcbiAgICBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICAgIHBhcnNlWWFtbCxcbiAgICBQbHVnaW4sXG59IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgU3RhdGJsb2NrUmVuZGVyZXIgfSBmcm9tIFwic3RhdGJsb2NrcmVuZGVyZXJcIjtcblxuLy8gY29uc3Qgc3JkRGF0YSA9IHJlcXVpcmUoXCJkYXRhLmpzb25cIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9uZVJpbmdQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIGFzeW5jIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1hcmtkb3duQ29kZUJsb2NrUHJvY2Vzc29yKFxuICAgICAgICAgICAgXCJ0b3IyZVwiLFxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTWFya2Rvd24uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIHByb2Nlc3NNYXJrZG93bihcbiAgICAgICAgc291cmNlOiBzdHJpbmcsXG4gICAgICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0XG4gICAgKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgeWFtbCA9IHBhcnNlWWFtbChzb3VyY2UpO1xuICAgICAgICBsZXQgcmVuZGVyRGF0YSA9IHsgLi4ueWFtbCB9O1xuXG4gICAgICAgIC8vIGlmICh5YW1sLm1vbnN0ZXIpIHtcbiAgICAgICAgLy8gXHRjb25zdCBsb29rdXBNb25zdGVyID0gc3JkRGF0YS5maW5kKCh4KSA9PiB4Lm5hbWUgPT09IHlhbWwubW9uc3Rlcik7XG4gICAgICAgIC8vIFx0aWYgKGxvb2t1cE1vbnN0ZXIpIHtcbiAgICAgICAgLy8gXHRcdHJlbmRlckRhdGEgPSB7IC4uLmxvb2t1cE1vbnN0ZXIsIC4uLnlhbWwgfTtcbiAgICAgICAgLy8gXHR9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBERUJVRzogVW5jb21tZW50IGhlcmUgdG8gb3V0cHV0IHRoZSBwYXJzZWQgWUFNTFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzb3VyY2UpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHlhbWwpXG5cbiAgICAgICAgY3R4LmFkZENoaWxkKG5ldyBTdGF0YmxvY2tSZW5kZXJlcihlbCwgY3R4LnNvdXJjZVBhdGgsIHJlbmRlckRhdGEpKTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHt9XG59XG4iLCAiaW1wb3J0IHsgTWFya2Rvd25SZW5kZXJDaGlsZCwgTWFya2Rvd25SZW5kZXJlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGJsb2NrUmVuZGVyZXIgZXh0ZW5kcyBNYXJrZG93blJlbmRlckNoaWxkIHtcbiAgICBzdGF0YmxvY2tFbDogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIGNvbnRleHQ6IHN0cmluZywgcHJpdmF0ZSBwYXJhbXM6IGFueSkge1xuICAgICAgICBzdXBlcihjb250YWluZXJFbCk7XG5cbiAgICAgICAgdGhpcy5zdGF0YmxvY2tFbCA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcInN0YXRibG9jay10b3IyZVwiIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuc3RhdGJsb2NrRWwuY3JlYXRlRGl2KHsgY2xzOiBcImZsLXIgZW1cIiwgdGV4dDogcGFyYW1zLnNvdXJjZSB9KTtcbiAgICAgICAgdGhpcy5zdGF0YmxvY2tFbC5jcmVhdGVFbChcImgyXCIsIHsgY2xzOiBcIm5vbWFyZ2luIGVtXCIsIHRleHQ6IHBhcmFtcy5uYW1lIH0pO1xuXG4gICAgICAgIGlmIChwYXJhbXMuYmx1cmIgIT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bihwYXJhbXMuYmx1cmIgfHwgcGFyYW1zLmRlc2NyaXB0aW9uLCB0aGlzLnN0YXRibG9ja0VsLCBjb250ZXh0LCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5hbWUsIEZlYXR1cmVzLCBBdHRyaWJ1dGUgTGV2ZWxcbiAgICAgICAgY29uc3QgdG9wU2VjdGlvbkVsID0gdGhpcy5zdGF0YmxvY2tFbC5jcmVhdGVFbChcInNlY3Rpb25cIiwgeyBjbHM6IFwibWF4d1wiIH0pO1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVFbCA9IHRvcFNlY3Rpb25FbC5jcmVhdGVEaXYoeyBjbHM6IFwiZmwtciBsZ1wiIH0pO1xuICAgICAgICBkaWFtb25kKGF0dHJpYnV0ZUVsLCBcIkF0dHJpYnV0ZSBMZXZlbFwiLCBwYXJhbXMubGV2ZWwpO1xuICAgICAgICB0b3BTZWN0aW9uRWwuY3JlYXRlRGl2KHsgY2xzOiBcImNhcHMgYm9sZCBub21hcmdpblwiLCB0ZXh0OiBwYXJhbXMubmFtZSB9KTtcblxuICAgICAgICBpZiAocGFyYW1zLmZlYXR1cmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKHBhcmFtcy5mZWF0dXJlcy5qb2luKFwiLCBcIiksIHRvcFNlY3Rpb25FbCwgY29udGV4dCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdGF0c1xuICAgICAgICBjb25zdCBzdGF0c0VsID0gdGhpcy5zdGF0YmxvY2tFbC5jcmVhdGVFbChcInNlY3Rpb25cIiwgeyBjbHM6IFwiY2xlYXJcIiB9KTtcbiAgICAgICAgZGlhbW9uZChzdGF0c0VsLCBcIkVuZHVyYW5jZVwiLCBwYXJhbXMuZW5kdXJhbmNlKTtcbiAgICAgICAgZGlhbW9uZChzdGF0c0VsLCBcIk1pZ2h0XCIsIHBhcmFtcy5taWdodCk7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5yZXNvbHZlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRpYW1vbmQoc3RhdHNFbCwgXCJSZXNvbHZlXCIsIHBhcmFtcy5yZXNvbHZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpYW1vbmQoc3RhdHNFbCwgXCJIYXRlXCIsIHBhcmFtcy5oYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMucGFycnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGlhbW9uZChzdGF0c0VsLCBcIlBhcnJ5XCIsIGJvbnVzKHBhcmFtcy5wYXJyeSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlhbW9uZChzdGF0c0VsLCBcIlBhcnJ5XCIsIFwiXFx1MjAxM1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbXMuYXJtb3VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRpYW1vbmQoc3RhdHNFbCwgXCJBcm1vdXJcIiwgcGFyYW1zLmFybW91cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWFtb25kKHN0YXRzRWwsIFwiQXJtb3VyXCIsIHBhcmFtcy5hcm1vcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21iYXQgUHJvZmljaWVuY2llc1xuICAgICAgICBpZiAocGFyYW1zLnByb2ZpY2llbmNpZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgcHJvZnNFbCA9IHRoaXMuc3RhdGJsb2NrRWwuY3JlYXRlRWwoXCJzZWN0aW9uXCIsIHsgY2xzOiBcImNsZWFyXCIgfSk7XG4gICAgICAgICAgICBwcm9mc0VsLmNyZWF0ZUVsKFwicFwiLCB7IGNsczogXCJjYXBzIGJvbGQgbm9tYXJnaW5cIiwgdGV4dDogXCJDb21iYXQgUHJvZmljaWVuY2llc1wiIH0pO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJhbXMucHJvZmljaWVuY2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2YgPSBwYXJhbXMucHJvZmljaWVuY2llc1tpXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9mU3BlY2lhbCA9IHByb2Yuc3BlY2lhbCA/IGAsICR7cHJvZi5zcGVjaWFsfWAgOiAnJztcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9mU3RyID0gYCR7cHJvZi5uYW1lfSAke3Byb2YucmF0aW5nfSAoJHtwcm9mLmRhbWFnZX0vJHtwcm9mLmluanVyeX0ke3Byb2ZTcGVjaWFsfSlgO1xuICAgICAgICAgICAgICAgIE1hcmtkb3duUmVuZGVyZXIucmVuZGVyTWFya2Rvd24ocHJvZlN0ciwgcHJvZnNFbCwgY29udGV4dCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGZWxsIEFiaWxpdGllc1xuICAgICAgICBpZiAocGFyYW1zLmFiaWxpdGllcykge1xuICAgICAgICAgICAgY29uc3QgYWJpbGl0aWVzRWwgPSB0aGlzLnN0YXRibG9ja0VsLmNyZWF0ZUVsKFwic2VjdGlvblwiLCB7IGNsczogXCJjbGVhclwiIH0pO1xuICAgICAgICAgICAgYWJpbGl0aWVzRWwuY3JlYXRlRWwoXCJwXCIsIHsgY2xzOiBcImNhcHMgYm9sZCBub21hcmdpblwiLCB0ZXh0OiBcIkZlbGwgQWJpbGl0aWVzXCIgfSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcmFtcy5hYmlsaXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKHBhcmFtcy5hYmlsaXRpZXNbaV0sIGFiaWxpdGllc0VsLCBjb250ZXh0LCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYm9udXMoc3RhdDogbnVtYmVyIHwgc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoc3RhdCA9PT0gMCkgcmV0dXJuIHN0YXQudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gc3RhdCA+IDAgPyBgKyR7c3RhdH1gIDogYCR7c3RhdH1gO1xufVxuXG5mdW5jdGlvbiBkaWFtb25kKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgbGFiZWw6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGlhbW9uZENvbnRhaW5lckVsID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcImF0dHItZGlhbW9uZC1jb250YWluZXJcIiB9KTtcbiAgICBkaWFtb25kQ29udGFpbmVyRWwuY3JlYXRlRGl2KHsgY2xzOiBcInNjIGFjY2VudCBib2xkIGF0dHItZGlhbW9uZC1sYWJlbFwiLCB0ZXh0OiBsYWJlbCB9KTtcbiAgICBjb25zdCBkaWFtb25kID0gZGlhbW9uZENvbnRhaW5lckVsLmNyZWF0ZURpdih7Y2xzOiBcImF0dHItZGlhbW9uZFwifSk7XG4gICAgbGV0IGRpYW1vbmRUZXh0ID0gdGV4dDtcbiAgICBsZXQgY2xhc3NlcyA9IFwiYXR0ci1kaWFtb25kLXRleHQgYm9sZCBhY2NlbnRcIjtcbiAgICBpZiAoZGlhbW9uZFRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkaWFtb25kVGV4dCA9IFwiXFx1MjAxM1wiO1xuICAgIH1cbiAgICBpZiAoZGlhbW9uZFRleHQgPT0gXCJcXHUyMDEzXCIpIHtcbiAgICAgICAgY2xhc3NlcyArPSBcIiBsaWZ0ZWRcIjtcbiAgICB9XG4gICAgcmV0dXJuIGRpYW1vbmQuY3JlYXRlRGl2KHtjbHM6IGNsYXNzZXMsIHRleHQ6IGRpYW1vbmRUZXh0IH0pO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFJTzs7O0FDSlAsc0JBQXNEO0FBRS9DLHNDQUFnQyxvQ0FBb0I7QUFBQSxFQUd2RCxZQUFZLGFBQTBCLFNBQXlCLFFBQWE7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
