import {
  getScopes,
  createFrame,
  getFrameLoadedObjects,
  getLoadedObjects,
  createScope
} from "../create";

const scopePacket = {
  actor: "server2.conn108.child1/36",
  type: "function",
  parent: {
    actor: "server2.conn108.child1/37",
    type: "function",
    parent: {
      actor: "server2.conn108.child1/38",
      type: "block",
      parent: {
        actor: "server2.conn108.child1/39",
        type: "object",
        object: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj40",
          class: "Window",
          extensible: true,
          frozen: false,
          sealed: false,
          ownPropertyLength: 751,
          preview: {
            kind: "ObjectWithURL",
            url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
          }
        }
      },
      bindings: { arguments: [], variables: {} }
    },
    function: {
      type: "object",
      actor: "server2.conn108.child1/pausedobj41",
      class: "Function",
      extensible: true,
      frozen: false,
      sealed: false,
      name: "math",
      displayName: "math",
      parameterNames: ["a", "b"],
      location: {
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
        line: 3
      }
    },
    bindings: {
      arguments: [
        {
          a: {
            enumerable: true,
            configurable: false,
            value: 2,
            writable: true
          }
        },
        {
          b: {
            enumerable: true,
            configurable: false,
            value: 3,
            writable: true
          }
        }
      ],
      variables: {
        arguments: {
          enumerable: true,
          configurable: false,
          value: {
            type: "object",
            actor: "server2.conn108.child1/pausedobj44",
            class: "Arguments",
            extensible: true,
            frozen: false,
            sealed: false,
            ownPropertyLength: 5,
            preview: {
              kind: "Object",
              ownProperties: {
                "0": {
                  configurable: true,
                  enumerable: true,
                  writable: true,
                  value: 2
                },
                "1": {
                  configurable: true,
                  enumerable: true,
                  writable: true,
                  value: 3
                }
              },
              ownPropertiesLength: 5,
              safeGetterValues: {}
            }
          },
          writable: true
        },
        bar: {
          enumerable: true,
          configurable: false,
          value: 4,
          writable: true
        },
        pythagorean: {
          enumerable: true,
          configurable: false,
          value: {
            type: "object",
            actor: "server2.conn108.child1/pausedobj42",
            class: "Function",
            extensible: true,
            frozen: false,
            sealed: false,
            name: "pythagorean",
            displayName: "pythagorean",
            parameterNames: ["a", "b"],
            location: {
              url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
              line: 5
            }
          },
          writable: true
        }
      }
    }
  },
  function: {
    type: "object",
    actor: "server2.conn108.child1/pausedobj42",
    class: "Function",
    extensible: true,
    frozen: false,
    sealed: false,
    name: "pythagorean",
    displayName: "pythagorean",
    parameterNames: ["a", "b"],
    location: {
      url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
      line: 5
    }
  },
  bindings: {
    arguments: [
      {
        a: {
          enumerable: true,
          configurable: false,
          value: 2,
          writable: true
        }
      },
      {
        b: {
          enumerable: true,
          configurable: false,
          value: 3,
          writable: true
        }
      }
    ],
    variables: {
      arguments: {
        enumerable: true,
        configurable: false,
        value: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj45",
          class: "Arguments",
          extensible: true,
          frozen: false,
          sealed: false,
          ownPropertyLength: 5,
          preview: {
            kind: "Object",
            ownProperties: {
              "0": {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 2
              },
              "1": {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 3
              }
            },
            ownPropertiesLength: 5,
            safeGetterValues: {}
          }
        },
        writable: true
      },
      foo: {
        enumerable: true,
        configurable: false,
        value: { type: "undefined" },
        writable: true
      },
      exponential: {
        enumerable: true,
        configurable: false,
        value: { type: "undefined" },
        writable: true
      }
    }
  }
};

const framesPacket = {
  frames: [
    {
      actor: "server2.conn108.child1/34",
      type: "call",
      callee: {
        type: "object",
        actor: "server2.conn108.child1/pausedobj35",
        class: "Function",
        extensible: true,
        frozen: false,
        sealed: false,
        name: "pythagorean",
        displayName: "pythagorean",
        parameterNames: ["a", "b"],
        location: {
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
          line: 5
        }
      },
      environment: {
        actor: "server2.conn108.child1/36",
        type: "function",
        parent: {
          actor: "server2.conn108.child1/37",
          type: "function",
          parent: {
            actor: "server2.conn108.child1/38",
            type: "block",
            parent: {
              actor: "server2.conn108.child1/39",
              type: "object",
              object: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj40",
                class: "Window",
                extensible: true,
                frozen: false,
                sealed: false,
                ownPropertyLength: 751,
                preview: {
                  kind: "ObjectWithURL",
                  url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
                }
              }
            },
            bindings: { arguments: [], variables: {} }
          },
          function: {
            type: "object",
            actor: "server2.conn108.child1/pausedobj41",
            class: "Function",
            extensible: true,
            frozen: false,
            sealed: false,
            name: "math",
            displayName: "math",
            parameterNames: ["a", "b"],
            location: {
              url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
              line: 3
            }
          },
          bindings: {
            arguments: [
              {
                a: {
                  enumerable: true,
                  configurable: false,
                  value: 2,
                  writable: true
                }
              },
              {
                b: {
                  enumerable: true,
                  configurable: false,
                  value: 3,
                  writable: true
                }
              }
            ],
            variables: {
              arguments: {
                enumerable: true,
                configurable: false,
                value: {
                  type: "object",
                  actor: "server2.conn108.child1/pausedobj44",
                  class: "Arguments",
                  extensible: true,
                  frozen: false,
                  sealed: false,
                  ownPropertyLength: 5,
                  preview: {
                    kind: "Object",
                    ownProperties: {
                      "0": {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: 2
                      },
                      "1": {
                        configurable: true,
                        enumerable: true,
                        writable: true,
                        value: 3
                      }
                    },
                    ownPropertiesLength: 5,
                    safeGetterValues: {}
                  }
                },
                writable: true
              },
              bar: {
                enumerable: true,
                configurable: false,
                value: 4,
                writable: true
              },
              pythagorean: {
                enumerable: true,
                configurable: false,
                value: {
                  type: "object",
                  actor: "server2.conn108.child1/pausedobj42",
                  class: "Function",
                  extensible: true,
                  frozen: false,
                  sealed: false,
                  name: "pythagorean",
                  displayName: "pythagorean",
                  parameterNames: ["a", "b"],
                  location: {
                    url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
                    line: 5
                  }
                },
                writable: true
              }
            }
          }
        },
        function: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj42",
          class: "Function",
          extensible: true,
          frozen: false,
          sealed: false,
          name: "pythagorean",
          displayName: "pythagorean",
          parameterNames: ["a", "b"],
          location: {
            url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
            line: 5
          }
        },
        bindings: {
          arguments: [
            {
              a: {
                enumerable: true,
                configurable: false,
                value: 2,
                writable: true
              }
            },
            {
              b: {
                enumerable: true,
                configurable: false,
                value: 3,
                writable: true
              }
            }
          ],
          variables: {
            arguments: {
              enumerable: true,
              configurable: false,
              value: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj45",
                class: "Arguments",
                extensible: true,
                frozen: false,
                sealed: false,
                ownPropertyLength: 5,
                preview: {
                  kind: "Object",
                  ownProperties: {
                    "0": {
                      configurable: true,
                      enumerable: true,
                      writable: true,
                      value: 2
                    },
                    "1": {
                      configurable: true,
                      enumerable: true,
                      writable: true,
                      value: 3
                    }
                  },
                  ownPropertiesLength: 5,
                  safeGetterValues: {}
                }
              },
              writable: true
            },
            foo: {
              enumerable: true,
              configurable: false,
              value: { type: "undefined" },
              writable: true
            },
            exponential: {
              enumerable: true,
              configurable: false,
              value: { type: "undefined" },
              writable: true
            }
          }
        }
      },
      this: { type: "undefined" },
      arguments: [2, 3],
      where: {
        source: {
          actor: "server2.conn108.child1/29",
          generatedUrl: null,
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
          isBlackBoxed: false,
          isPrettyPrinted: false,
          isSourceMapped: false,
          sourceMapURL: null,
          introductionUrl: null,
          introductionType: "scriptElement"
        },
        line: 7,
        column: 0
      },
      depth: 0,
      source: {
        actor: "server2.conn108.child1/29",
        generatedUrl: null,
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
        isBlackBoxed: false,
        isPrettyPrinted: false,
        isSourceMapped: false,
        sourceMapURL: null,
        introductionUrl: null,
        introductionType: "scriptElement"
      }
    },
    {
      actor: "server2.conn108.child1/46",
      type: "call",
      callee: {
        type: "object",
        actor: "server2.conn108.child1/pausedobj47",
        class: "Function",
        extensible: true,
        frozen: false,
        sealed: false,
        name: "math",
        displayName: "math",
        parameterNames: ["a", "b"],
        location: {
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
          line: 3
        }
      },
      environment: {
        actor: "server2.conn108.child1/37",
        type: "function",
        parent: {
          actor: "server2.conn108.child1/38",
          type: "block",
          parent: {
            actor: "server2.conn108.child1/39",
            type: "object",
            object: {
              type: "object",
              actor: "server2.conn108.child1/pausedobj40",
              class: "Window",
              extensible: true,
              frozen: false,
              sealed: false,
              ownPropertyLength: 751,
              preview: {
                kind: "ObjectWithURL",
                url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
              }
            }
          },
          bindings: { arguments: [], variables: {} }
        },
        function: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj41",
          class: "Function",
          extensible: true,
          frozen: false,
          sealed: false,
          name: "math",
          displayName: "math",
          parameterNames: ["a", "b"],
          location: {
            url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
            line: 3
          }
        },
        bindings: {
          arguments: [
            {
              a: {
                enumerable: true,
                configurable: false,
                value: 2,
                writable: true
              }
            },
            {
              b: {
                enumerable: true,
                configurable: false,
                value: 3,
                writable: true
              }
            }
          ],
          variables: {
            arguments: {
              enumerable: true,
              configurable: false,
              value: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj48",
                class: "Arguments",
                extensible: true,
                frozen: false,
                sealed: false,
                ownPropertyLength: 5,
                preview: {
                  kind: "Object",
                  ownProperties: {
                    "0": {
                      configurable: true,
                      enumerable: true,
                      writable: true,
                      value: 2
                    },
                    "1": {
                      configurable: true,
                      enumerable: true,
                      writable: true,
                      value: 3
                    }
                  },
                  ownPropertiesLength: 5,
                  safeGetterValues: {}
                }
              },
              writable: true
            },
            bar: {
              enumerable: true,
              configurable: false,
              value: 4,
              writable: true
            },
            pythagorean: {
              enumerable: true,
              configurable: false,
              value: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj42",
                class: "Function",
                extensible: true,
                frozen: false,
                sealed: false,
                name: "pythagorean",
                displayName: "pythagorean",
                parameterNames: ["a", "b"],
                location: {
                  url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
                  line: 5
                }
              },
              writable: true
            }
          }
        }
      },
      this: { type: "undefined" },
      arguments: [2, 3],
      where: {
        source: {
          actor: "server2.conn108.child1/29",
          generatedUrl: null,
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
          isBlackBoxed: false,
          isPrettyPrinted: false,
          isSourceMapped: false,
          sourceMapURL: null,
          introductionUrl: null,
          introductionType: "scriptElement"
        },
        line: 14,
        column: 2
      },
      depth: 1,
      source: {
        actor: "server2.conn108.child1/29",
        generatedUrl: null,
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
        isBlackBoxed: false,
        isPrettyPrinted: false,
        isSourceMapped: false,
        sourceMapURL: null,
        introductionUrl: null,
        introductionType: "scriptElement"
      }
    },
    {
      actor: "server2.conn108.child1/49",
      type: "call",
      callee: {
        type: "object",
        actor: "server2.conn108.child1/pausedobj50",
        class: "Function",
        extensible: true,
        frozen: false,
        sealed: false,
        name: "onclick",
        displayName: "onclick",
        parameterNames: ["event"],
        location: {
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/",
          line: 1
        }
      },
      environment: {
        actor: "server2.conn108.child1/51",
        type: "function",
        parent: {
          actor: "server2.conn108.child1/52",
          type: "block",
          parent: {
            actor: "server2.conn108.child1/53",
            type: "with",
            parent: {
              actor: "server2.conn108.child1/54",
              type: "with",
              parent: {
                actor: "server2.conn108.child1/38",
                type: "block",
                parent: {
                  actor: "server2.conn108.child1/39",
                  type: "object",
                  object: {
                    type: "object",
                    actor: "server2.conn108.child1/pausedobj40",
                    class: "Window",
                    extensible: true,
                    frozen: false,
                    sealed: false,
                    ownPropertyLength: 751,
                    preview: {
                      kind: "ObjectWithURL",
                      url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
                    }
                  }
                },
                bindings: { arguments: [], variables: {} }
              },
              object: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj55",
                class: "HTMLDocument",
                extensible: true,
                frozen: false,
                sealed: false,
                ownPropertyLength: 1,
                preview: {
                  kind: "DOMNode",
                  nodeType: 9,
                  nodeName: "#document",
                  location: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
                }
              }
            },
            object: {
              type: "object",
              actor: "server2.conn108.child1/pausedobj56",
              class: "HTMLButtonElement",
              extensible: true,
              frozen: false,
              sealed: false,
              ownPropertyLength: 0,
              preview: {
                kind: "DOMNode",
                nodeType: 1,
                nodeName: "button",
                attributes: { onclick: "math(2,3)" },
                attributesLength: 1
              }
            }
          },
          bindings: { arguments: [], variables: {} }
        },
        function: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj57",
          class: "Function",
          extensible: true,
          frozen: false,
          sealed: false,
          name: "onclick",
          displayName: "onclick",
          parameterNames: ["event"],
          location: {
            url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/",
            line: 1
          }
        },
        bindings: {
          arguments: [
            {
              event: {
                enumerable: true,
                configurable: false,
                value: {
                  type: "object",
                  actor: "server2.conn108.child1/pausedobj58",
                  class: "MouseEvent",
                  extensible: true,
                  frozen: false,
                  sealed: false,
                  ownPropertyLength: 1,
                  preview: {
                    kind: "DOMEvent",
                    type: "click",
                    properties: {
                      buttons: 0,
                      clientX: 48,
                      clientY: 15,
                      layerX: 48,
                      layerY: 15
                    },
                    target: {
                      type: "object",
                      actor: "server2.conn108.child1/pausedobj59",
                      class: "HTMLButtonElement",
                      extensible: true,
                      frozen: false,
                      sealed: false,
                      ownPropertyLength: 0,
                      preview: {
                        kind: "DOMNode",
                        nodeType: 1,
                        nodeName: "button",
                        attributes: { onclick: "math(2,3)" },
                        attributesLength: 1
                      }
                    }
                  }
                },
                writable: true
              }
            }
          ],
          variables: {
            arguments: {
              enumerable: true,
              configurable: false,
              value: {
                type: "object",
                actor: "server2.conn108.child1/pausedobj60",
                class: "Arguments",
                extensible: true,
                frozen: false,
                sealed: false,
                ownPropertyLength: 3,
                preview: {
                  kind: "Object",
                  ownProperties: {
                    "0": {
                      configurable: true,
                      enumerable: true,
                      writable: true,
                      value: {
                        type: "object",
                        actor: "server2.conn108.child1/pausedobj61",
                        class: "MouseEvent",
                        extensible: true,
                        frozen: false,
                        sealed: false,
                        ownPropertyLength: 1,
                        preview: {
                          kind: "DOMEvent",
                          type: "click",
                          properties: {
                            buttons: 0,
                            clientX: 48,
                            clientY: 15,
                            layerX: 48,
                            layerY: 15
                          }
                        }
                      }
                    }
                  },
                  ownPropertiesLength: 3,
                  safeGetterValues: {}
                }
              },
              writable: true
            }
          }
        }
      },
      this: {
        type: "object",
        actor: "server2.conn108.child1/pausedobj59",
        class: "HTMLButtonElement",
        extensible: true,
        frozen: false,
        sealed: false,
        ownPropertyLength: 0,
        preview: {
          kind: "DOMNode",
          nodeType: 1,
          nodeName: "button",
          attributes: { onclick: "math(2,3)" },
          attributesLength: 1
        }
      },
      arguments: [
        {
          type: "object",
          actor: "server2.conn108.child1/pausedobj61",
          class: "MouseEvent",
          extensible: true,
          frozen: false,
          sealed: false,
          ownPropertyLength: 1,
          preview: {
            kind: "DOMEvent",
            type: "click",
            properties: {
              buttons: 0,
              clientX: 48,
              clientY: 15,
              layerX: 48,
              layerY: 15
            },
            target: {
              type: "object",
              actor: "server2.conn108.child1/pausedobj59",
              class: "HTMLButtonElement",
              extensible: true,
              frozen: false,
              sealed: false,
              ownPropertyLength: 0,
              preview: {
                kind: "DOMNode",
                nodeType: 1,
                nodeName: "button",
                attributes: { onclick: "math(2,3)" },
                attributesLength: 1
              }
            }
          }
        }
      ],
      where: {
        source: {
          actor: "server2.conn108.child1/32",
          generatedUrl: null,
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/",
          isBlackBoxed: false,
          isPrettyPrinted: false,
          isSourceMapped: false,
          sourceMapURL: null,
          introductionUrl: null,
          introductionType: null
        },
        line: 1,
        column: 0
      },
      oldest: true,
      depth: 2,
      source: {
        actor: "server2.conn108.child1/32",
        generatedUrl: null,
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/",
        isBlackBoxed: false,
        isPrettyPrinted: false,
        isSourceMapped: false,
        sourceMapURL: null,
        introductionUrl: null,
        introductionType: null
      }
    }
  ],
  from: "server2.conn108.child1/27"
};

const pausedPacket = {
  from: "server2.conn108.child1/27",
  type: "paused",
  actor: "server2.conn108.child1/pause33",
  frame: {
    actor: "server2.conn108.child1/34",
    type: "call",
    callee: {
      type: "object",
      actor: "server2.conn108.child1/pausedobj35",
      class: "Function",
      extensible: true,
      frozen: false,
      sealed: false,
      name: "pythagorean",
      displayName: "pythagorean",
      parameterNames: ["a", "b"],
      location: {
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
        line: 5
      }
    },
    environment: {
      actor: "server2.conn108.child1/36",
      type: "function",
      parent: {
        actor: "server2.conn108.child1/37",
        type: "function",
        parent: {
          actor: "server2.conn108.child1/38",
          type: "block",
          parent: {
            actor: "server2.conn108.child1/39",
            type: "object",
            object: {
              type: "object",
              actor: "server2.conn108.child1/pausedobj40",
              class: "Window",
              extensible: true,
              frozen: false,
              sealed: false,
              ownPropertyLength: 751,
              preview: {
                kind: "ObjectWithURL",
                url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/"
              }
            }
          },
          bindings: { arguments: [], variables: {} }
        },
        function: {
          type: "object",
          actor: "server2.conn108.child1/pausedobj41",
          class: "Function",
          extensible: true,
          frozen: false,
          sealed: false,
          name: "math",
          displayName: "math",
          parameterNames: ["a", "b"],
          location: {
            url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
            line: 3
          }
        },
        bindings: {
          arguments: [
            {
              a: {
                enumerable: true,
                configurable: false,
                value: { type: "null", optimizedOut: true },
                writable: false
              }
            },
            {
              b: {
                enumerable: true,
                configurable: false,
                value: { type: "null", optimizedOut: true },
                writable: false
              }
            }
          ],
          variables: {
            arguments: {
              enumerable: true,
              configurable: false,
              value: { type: "null", missingArguments: true },
              writable: false
            },
            bar: {
              enumerable: true,
              configurable: false,
              value: 4,
              writable: true
            },
            pythagorean: {
              enumerable: true,
              configurable: false,
              value: { type: "null", optimizedOut: true },
              writable: false
            }
          }
        }
      },
      function: {
        type: "object",
        actor: "server2.conn108.child1/pausedobj42",
        class: "Function",
        extensible: true,
        frozen: false,
        sealed: false,
        name: "pythagorean",
        displayName: "pythagorean",
        parameterNames: ["a", "b"],
        location: {
          url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
          line: 5
        }
      },
      bindings: {
        arguments: [
          {
            a: {
              enumerable: true,
              configurable: false,
              value: 2,
              writable: true
            }
          },
          {
            b: {
              enumerable: true,
              configurable: false,
              value: 3,
              writable: true
            }
          }
        ],
        variables: {
          arguments: {
            enumerable: true,
            configurable: false,
            value: {
              type: "object",
              actor: "server2.conn108.child1/pausedobj43",
              class: "Arguments",
              extensible: true,
              frozen: false,
              sealed: false,
              ownPropertyLength: 5,
              preview: {
                kind: "Object",
                ownProperties: {
                  "0": {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: 2
                  },
                  "1": {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: 3
                  }
                },
                ownPropertiesLength: 5,
                safeGetterValues: {}
              }
            },
            writable: true
          },
          foo: {
            enumerable: true,
            configurable: false,
            value: { type: "undefined" },
            writable: true
          },
          exponential: {
            enumerable: true,
            configurable: false,
            value: { type: "undefined" },
            writable: true
          }
        }
      }
    },
    this: { type: "undefined" },
    arguments: [2, 3],
    where: {
      source: {
        actor: "server2.conn108.child1/29",
        generatedUrl: null,
        url: "https://devtools-html.github.io/debugger-examples/examples/pythagorean/pythagorean.js",
        isBlackBoxed: false,
        isPrettyPrinted: false,
        isSourceMapped: false,
        sourceMapURL: null,
        introductionUrl: null,
        introductionType: "scriptElement"
      },
      line: 7,
      column: 0
    }
  },
  poppedFrames: [],
  why: { type: "breakpoint", actors: ["server2.conn108.child1/31"] }
};

describe("firefox - create utils", () => {
  it("get scopes", () => {
    const scopes = getScopes(scopePacket);
    expect(scopes.length).toEqual(4);
  });

  describe("getLoadedObjects", () => {
    it("can get binding variables (for scope)", () => {
      const objects = getLoadedObjects(createScope(scopePacket, 0));
      console.log(objects);
      expect(objects.length).toEqual(7);
    });

    it.only("can get binding variables (for frame)", () => {
      const objects = getFrameLoadedObjects(
        createFrame(framesPacket.frames[0])
      );
      console.log(objects);
      expect(objects.length).toEqual(7);
    });
  });
});
