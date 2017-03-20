"use strict";
process.env.NODE_ENV = "test";
process.env.FORMAT = "csv";

const _ = require("underscore");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const format = require("../../lib/format");

describe.only("Format - JSON to CSV", () => {
  describe("freqDist", () => {

    it("Single Task", () => {
      // freqDist: [
      //   {
      //     target: "li.user.member.country",
      //     threshold: 2
      //   }
      // ]
      let config = {
        interactions: 1011358400,
        unique_authors: 50740300,
        analysis: {
          analysis_type: "freqDist",
          parameters: {
            target: "li.user.member.country",
            threshold: 2
          },
          results: [
            {
              key: "united states",
              interactions: 253461200,
              unique_authors: 16234000
            },
            {
              key: "united kingdom",
              interactions: 105130600,
              unique_authors: 3980000
            }
          ],
          redacted: false
        }
      };

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,interactions,unique_authors\n" +
            "united states,253461200,16234000\n" +
            "united kingdom,105130600,3980000\n"
        );
      });
    });

    it("native nested - 1 level", () => {
      // freqDist: [
      //   {
      //     target: "li.user.member.country",
      //     threshold: 2,
      //     child: {
      //       target: "li.all.articles.author.member.gender",
      //       threshold: 2,
      //     }
      //   }
      // ]

      let config = {
        interactions: 1011445100,
        unique_authors: 50792300,
        analysis: {
          analysis_type: "freqDist",
          parameters: {
            target: "li.user.member.country",
            threshold: 2
          },
          results: [
            {
              key: "united states",
              interactions: 253358500,
              unique_authors: 16234000,
              child: {
                analysis_type: "freqDist",
                parameters: {
                  target: "li.all.articles.author.member.gender",
                  threshold: 2
                },
                results: [
                  {
                    key: "male",
                    interactions: 34054100,
                    unique_authors: 7485700
                  },
                  {
                    key: "female",
                    interactions: 11252900,
                    unique_authors: 4015900
                  }
                ],
                redacted: false
              }
            },
            {
              key: "united kingdom",
              interactions: 105173800,
              unique_authors: 3980000,
              child: {
                analysis_type: "freqDist",
                parameters: {
                  target: "li.all.articles.author.member.gender",
                  threshold: 2
                },
                results: [
                  {
                    key: "male",
                    interactions: 9481000,
                    unique_authors: 1798200
                  },
                  {
                    key: "female",
                    interactions: 3216600,
                    unique_authors: 1045000
                  }
                ],
                redacted: false
              }
            }
          ],
          redacted: false
        }
      };

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key1_interactions,key1_unique_authors,key2,interactions,unique_authors\n" +
            "united states,253358500,16234000,male,34054100,7485700\n" +
            "united states,253358500,16234000,female,11252900,4015900\n" +
            "united kingdom,105173800,3980000,male,9481000,1798200\n" +
            "united kingdom,105173800,3980000,female,3216600,1045000\n"
        );
      });
    });

    it("native nested - 2 level", () => {
      // freqDist: [
      //   {
      //     target: "li.user.member.country",
      //     threshold: 2,
      //     child: {
      //       target: "li.all.articles.author.member.gender",
      //       threshold: 2,
      //       child: {
      //         target: "li.all.articles.author.member.age",
      //         threshold: 2,
      //       }
      //     }
      //   }
      // ]

      let config = {
        interactions: 1011392600,
        unique_authors: 50792300,
        analysis: {
          analysis_type: "freqDist",
          parameters: {
            target: "li.user.member.country",
            threshold: 2
          },
          results: [
            {
              key: "united states",
              interactions: 253321000,
              unique_authors: 16234000,
              child: {
                analysis_type: "freqDist",
                parameters: {
                  target: "li.all.articles.author.member.gender",
                  threshold: 2
                },
                results: [
                  {
                    key: "male",
                    interactions: 34047900,
                    unique_authors: 7485700,
                    child: {
                      analysis_type: "freqDist",
                      parameters: {
                        target: "li.all.articles.author.member.age",
                        threshold: 2
                      },
                      results: [
                        {
                          key: "35-54",
                          interactions: 13632900,
                          unique_authors: 4281900
                        },
                        {
                          key: "unknown",
                          interactions: 9329800,
                          unique_authors: 3262300
                        }
                      ],
                      redacted: false
                    }
                  },
                  {
                    key: "female",
                    interactions: 11250800,
                    unique_authors: 4015900,
                    child: {
                      analysis_type: "freqDist",
                      parameters: {
                        target: "li.all.articles.author.member.age",
                        threshold: 2
                      },
                      results: [
                        {
                          key: "35-54",
                          interactions: 3729100,
                          unique_authors: 1725400
                        },
                        {
                          key: "unknown",
                          interactions: 2979200,
                          unique_authors: 1432600
                        }
                      ],
                      redacted: false
                    }
                  }
                ],
                redacted: false
              }
            },
            {
              key: "united kingdom",
              interactions: 105172100,
              unique_authors: 3980000,
              child: {
                analysis_type: "freqDist",
                parameters: {
                  target: "li.all.articles.author.member.gender",
                  threshold: 2
                },
                results: [
                  {
                    key: "male",
                    interactions: 9480300,
                    unique_authors: 1798200,
                    child: {
                      analysis_type: "freqDist",
                      parameters: {
                        target: "li.all.articles.author.member.age",
                        threshold: 2
                      },
                      results: [
                        {
                          key: "35-54",
                          interactions: 4145100,
                          unique_authors: 1139000
                        },
                        {
                          key: "unknown",
                          interactions: 2378200,
                          unique_authors: 800500
                        }
                      ],
                      redacted: false
                    }
                  },
                  {
                    key: "female",
                    interactions: 3216300,
                    unique_authors: 1045000,
                    child: {
                      analysis_type: "freqDist",
                      parameters: {
                        target: "li.all.articles.author.member.age",
                        threshold: 2
                      },
                      results: [
                        {
                          key: "35-54",
                          interactions: 1169400,
                          unique_authors: 478500
                        },
                        {
                          key: "25-34",
                          interactions: 711800,
                          unique_authors: 327400
                        }
                      ],
                      redacted: false
                    }
                  }
                ],
                redacted: false
              }
            }
          ],
          redacted: false
        }
      };

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key1_interactions,key1_unique_authors,key2,key2_interactions,key2_unique_authors,key3,interactions,unique_authors\n" +
            "united states,253321000,16234000,male,34047900,7485700,35-54,13632900,4281900\n" +
            "united states,253321000,16234000,male,34047900,7485700,unknown,9329800,3262300\n" +
            "united states,253321000,16234000,female,11250800,4015900,35-54,3729100,1725400\n" +
            "united states,253321000,16234000,female,11250800,4015900,unknown,2979200,1432600\n" +
            "united kingdom,105172100,3980000,male,9480300,1798200,35-54,4145100,1139000\n" +
            "united kingdom,105172100,3980000,male,9480300,1798200,unknown,2378200,800500\n" +
            "united kingdom,105172100,3980000,female,3216300,1045000,35-54,1169400,478500\n" +
            "united kingdom,105172100,3980000,female,3216300,1045000,25-34,711800,327400\n"
        );
      });
    });

    it("merged", () => {

      // freqDist: [
      //   {
      //     "foo": [
      //       {
      //         filter: 'li.content ANY "trump"',
      //         id: "yogi",
      //         target: "li.user.member.employer_industry_sectors",
      //         threshold: 2
      //       },
      //       {
      //         id: "booboo",
      //         target: "li.user.member.employer_industry_sectors",
      //         threshold: 2
      //       }
      //     ]
      //   }
      // ]

      let config = [
          {
            "yogi": {
              "interactions": 188700,
              "unique_authors": 56800,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 20300,
                    "unique_authors": 5500
                  },
                  {
                    "key": "finance",
                    "interactions": 18500,
                    "unique_authors": 7800
                  }
                ],
                "redacted": false
              }
            },
            "booboo": {
              "interactions": 1011554600,
              "unique_authors": 50844500,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 159521100,
                    "unique_authors": 6605300
                  },
                  {
                    "key": "finance",
                    "interactions": 109397600,
                    "unique_authors": 5097200
                  }
                ],
                "redacted": false
              }
            }
          }
        ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.a("string");
        expect(result).to.eql(
          'key1,key1_interactions,key1_unique_authors,key2,interactions,unique_authors\n' +
          'yogi,188700,56800,high-tech,20300,5500\n' +
          'yogi,188700,56800,finance,18500,7800\n' +
          'booboo,1011554600,50844500,high-tech,159521100,6605300\n' +
          'booboo,1011554600,50844500,finance,109397600,5097200\n');
      });
    });

    it("merged - native nested - 1 level", () => {

      // freqDist: [
      //   {
      //     "foo": [
      //       {
      //         id: "yogi",
      //         filter: 'li.content ANY "trump"',
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         child: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //         }
      //       },
      //       {
      //         id: "booboo",
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         child: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //         }
      //       }
      //     ]
      //   }
      // ]

      let config = [
        {
          "yogi": {
            "interactions": 188800,
            "unique_authors": 56800,
            "analysis": {
              "analysis_type": "freqDist",
              "parameters": {
                "target": "li.user.member.country",
                "threshold": 2
              },
              "results": [
                {
                  "key": "united states",
                  "interactions": 95200,
                  "unique_authors": 24200,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 3500,
                        "unique_authors": 2100
                      },
                      {
                        "key": "female",
                        "interactions": 800,
                        "unique_authors": 600
                      }
                    ],
                    "redacted": false
                  }
                },
                {
                  "key": "united kingdom",
                  "interactions": 8800,
                  "unique_authors": 3500,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 400,
                        "unique_authors": 300
                      }
                    ],
                    "redacted": false
                  }
                }
              ],
              "redacted": false
            }
          },
          "booboo": {
            "interactions": 1011538800,
            "unique_authors": 50844500,
            "analysis": {
              "analysis_type": "freqDist",
              "parameters": {
                "target": "li.user.member.country",
                "threshold": 2
              },
              "results": [
                {
                  "key": "united states",
                  "interactions": 253027400,
                  "unique_authors": 16234000,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 33977600,
                        "unique_authors": 7468200
                      },
                      {
                        "key": "female",
                        "interactions": 11224900,
                        "unique_authors": 4009900
                      }
                    ],
                    "redacted": false
                  }
                },
                {
                  "key": "united kingdom",
                  "interactions": 105228300,
                  "unique_authors": 3980000,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 9474400,
                        "unique_authors": 1801300
                      },
                      {
                        "key": "female",
                        "interactions": 3214900,
                        "unique_authors": 1046400
                      }
                    ],
                    "redacted": false
                  }
                }
              ],
              "redacted": false
            }
          }
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          'key1,key1_interactions,key1_unique_authors,key2,key2_interactions,key2_unique_authors,key3,interactions,unique_authors\n' +
          'yogi,188800,56800,united states,95200,24200,male,3500,2100\n' +
          'yogi,188800,56800,united states,95200,24200,female,800,600\n' +
          'yogi,188800,56800,united kingdom,8800,3500,male,400,300\n' +
          'booboo,1011538800,50844500,united states,253027400,16234000,male,33977600,7468200\n' +
          'booboo,1011538800,50844500,united states,253027400,16234000,female,11224900,4009900\n' +
          'booboo,1011538800,50844500,united kingdom,105228300,3980000,male,9474400,1801300\n' +
          'booboo,1011538800,50844500,united kingdom,105228300,3980000,female,3214900,1046400\n');
      });
    });

    it("merged - native nested - 2 level", () => {

      // freqDist: [
      //   {
      //     "foo": [
      //       {
      //         id: "yogi",
      //         filter: "li.content ANY \"trump, amazon, aws, tesla\"",
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         child: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //           child: {
      //             target: "li.all.articles.author.member.age",
      //             threshold: 2
      //           }
      //         }
      //       },
      //       {
      //         id: "booboo",
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         child: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //           child: {
      //             target: "li.all.articles.author.member.age",
      //             threshold: 2
      //           }
      //         }
      //       }
      //     ]
      //   }
      // ]

      let config = [
          {
            "yogi": {
              "interactions": 306800,
              "unique_authors": 112600,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.country",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "united states",
                    "interactions": 142900,
                    "unique_authors": 47600,
                    "child": {
                      "analysis_type": "freqDist",
                      "parameters": {
                        "target": "li.all.articles.author.member.gender",
                        "threshold": 2
                      },
                      "results": [
                        {
                          "key": "male",
                          "interactions": 4900,
                          "unique_authors": 3300,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 1700,
                                "unique_authors": 1400
                              },
                              {
                                "key": "55+",
                                "interactions": 1400,
                                "unique_authors": 1000
                              }
                            ],
                            "redacted": false
                          }
                        },
                        {
                          "key": "female",
                          "interactions": 1100,
                          "unique_authors": 900,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 400,
                                "unique_authors": 300
                              },
                              {
                                "key": "25-34",
                                "interactions": 200,
                                "unique_authors": 200
                              }
                            ],
                            "redacted": false
                          }
                        }
                      ],
                      "redacted": false
                    }
                  },
                  {
                    "key": "united kingdom",
                    "interactions": 18300,
                    "unique_authors": 8600,
                    "child": {
                      "analysis_type": "freqDist",
                      "parameters": {
                        "target": "li.all.articles.author.member.gender",
                        "threshold": 2
                      },
                      "results": [
                        {
                          "key": "male",
                          "interactions": 600,
                          "unique_authors": 500,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 300,
                                "unique_authors": 200
                              },
                              {
                                "key": "55+",
                                "interactions": 100,
                                "unique_authors": 100
                              }
                            ],
                            "redacted": false
                          }
                        },
                        {
                          "key": "female",
                          "interactions": 100,
                          "unique_authors": 100,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [],
                            "redacted": false
                          }
                        }
                      ],
                      "redacted": false
                    }
                  }
                ],
                "redacted": false
              }
            },
            "booboo": {
              "interactions": 985526400,
              "unique_authors": 50740500,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.country",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "united states",
                    "interactions": 243311000,
                    "unique_authors": 15517900,
                    "child": {
                      "analysis_type": "freqDist",
                      "parameters": {
                        "target": "li.all.articles.author.member.gender",
                        "threshold": 2
                      },
                      "results": [
                        {
                          "key": "male",
                          "interactions": 31642600,
                          "unique_authors": 7159000,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 12671300,
                                "unique_authors": 4057000
                              },
                              {
                                "key": "unknown",
                                "interactions": 8406800,
                                "unique_authors": 3014300
                              }
                            ],
                            "redacted": false
                          }
                        },
                        {
                          "key": "female",
                          "interactions": 10751400,
                          "unique_authors": 3911300,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 3532600,
                                "unique_authors": 1690100
                              },
                              {
                                "key": "unknown",
                                "interactions": 2831000,
                                "unique_authors": 1369100
                              }
                            ],
                            "redacted": false
                          }
                        }
                      ],
                      "redacted": false
                    }
                  },
                  {
                    "key": "united kingdom",
                    "interactions": 101058800,
                    "unique_authors": 3887200,
                    "child": {
                      "analysis_type": "freqDist",
                      "parameters": {
                        "target": "li.all.articles.author.member.gender",
                        "threshold": 2
                      },
                      "results": [
                        {
                          "key": "male",
                          "interactions": 8869200,
                          "unique_authors": 1690400,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 3856700,
                                "unique_authors": 1043000
                              },
                              {
                                "key": "unknown",
                                "interactions": 2171800,
                                "unique_authors": 756800
                              }
                            ],
                            "redacted": false
                          }
                        },
                        {
                          "key": "female",
                          "interactions": 3083100,
                          "unique_authors": 1031900,
                          "child": {
                            "analysis_type": "freqDist",
                            "parameters": {
                              "target": "li.all.articles.author.member.age",
                              "threshold": 2
                            },
                            "results": [
                              {
                                "key": "35-54",
                                "interactions": 1114100,
                                "unique_authors": 465300
                              },
                              {
                                "key": "25-34",
                                "interactions": 702100,
                                "unique_authors": 322700
                              }
                            ],
                            "redacted": false
                          }
                        }
                      ],
                      "redacted": false
                    }
                  }
                ],
                "redacted": false
              }
            }
          }
        ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.a("string");
        expect(result).to.eql(
          'key1,key1_interactions,key1_unique_authors,' +
          'key2,key2_interactions,key2_unique_authors,' +
          'key3,key3_interactions,key3_unique_authors,' +
          'key4,interactions,unique_authors\n' +
          'yogi,306800,112600,united states,142900,47600,male,4900,3300,35-54,1700,1400\n' +
          'yogi,306800,112600,united states,142900,47600,male,4900,3300,55+,1400,1000\n' +
          'yogi,306800,112600,united states,142900,47600,female,1100,900,35-54,400,300\n' +
          'yogi,306800,112600,united states,142900,47600,female,1100,900,25-34,200,200\n' +
          'yogi,306800,112600,united kingdom,18300,8600,male,600,500,35-54,300,200\n' +
          'yogi,306800,112600,united kingdom,18300,8600,male,600,500,55+,100,100\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,male,31642600,7159000,35-54,12671300,4057000\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,male,31642600,7159000,unknown,8406800,3014300\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,female,10751400,3911300,35-54,3532600,1690100\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,female,10751400,3911300,unknown,2831000,1369100\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,male,8869200,1690400,35-54,3856700,1043000\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,male,8869200,1690400,unknown,2171800,756800\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,female,3083100,1031900,35-54,1114100,465300\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,female,3083100,1031900,25-34,702100,322700\n'
        );
      });
    });

    it("merged - native nested - 2 level - empty result sets", () => {
      // note empty results for booboo, uk, female, age

      let config = [
        {
          "yogi": {
            "interactions": 306800,
            "unique_authors": 112600,
            "analysis": {
              "analysis_type": "freqDist",
              "parameters": {
                "target": "li.user.member.country",
                "threshold": 2
              },
              "results": [
                {
                  "key": "united states",
                  "interactions": 142900,
                  "unique_authors": 47600,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 4900,
                        "unique_authors": 3300,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 1700,
                              "unique_authors": 1400
                            },
                            {
                              "key": "55+",
                              "interactions": 1400,
                              "unique_authors": 1000
                            }
                          ],
                          "redacted": false
                        }
                      },
                      {
                        "key": "female",
                        "interactions": 1100,
                        "unique_authors": 900,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 400,
                              "unique_authors": 300
                            },
                            {
                              "key": "25-34",
                              "interactions": 200,
                              "unique_authors": 200
                            }
                          ],
                          "redacted": false
                        }
                      }
                    ],
                    "redacted": false
                  }
                },
                {
                  "key": "united kingdom",
                  "interactions": 18300,
                  "unique_authors": 8600,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 600,
                        "unique_authors": 500,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 300,
                              "unique_authors": 200
                            },
                            {
                              "key": "55+",
                              "interactions": 100,
                              "unique_authors": 100
                            }
                          ],
                          "redacted": false
                        }
                      },
                      {
                        "key": "female",
                        "interactions": 100,
                        "unique_authors": 100,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [],
                          "redacted": false
                        }
                      }
                    ],
                    "redacted": false
                  }
                }
              ],
              "redacted": false
            }
          },
          "booboo": {
            "interactions": 985526400,
            "unique_authors": 50740500,
            "analysis": {
              "analysis_type": "freqDist",
              "parameters": {
                "target": "li.user.member.country",
                "threshold": 2
              },
              "results": [
                {
                  "key": "united states",
                  "interactions": 243311000,
                  "unique_authors": 15517900,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 31642600,
                        "unique_authors": 7159000,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 12671300,
                              "unique_authors": 4057000
                            },
                            {
                              "key": "unknown",
                              "interactions": 8406800,
                              "unique_authors": 3014300
                            }
                          ],
                          "redacted": false
                        }
                      },
                      {
                        "key": "female",
                        "interactions": 10751400,
                        "unique_authors": 3911300,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 3532600,
                              "unique_authors": 1690100
                            },
                            {
                              "key": "unknown",
                              "interactions": 2831000,
                              "unique_authors": 1369100
                            }
                          ],
                          "redacted": false
                        }
                      }
                    ],
                    "redacted": false
                  }
                },
                {
                  "key": "united kingdom",
                  "interactions": 101058800,
                  "unique_authors": 3887200,
                  "child": {
                    "analysis_type": "freqDist",
                    "parameters": {
                      "target": "li.all.articles.author.member.gender",
                      "threshold": 2
                    },
                    "results": [
                      {
                        "key": "male",
                        "interactions": 8869200,
                        "unique_authors": 1690400,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [
                            {
                              "key": "35-54",
                              "interactions": 3856700,
                              "unique_authors": 1043000
                            },
                            {
                              "key": "unknown",
                              "interactions": 2171800,
                              "unique_authors": 756800
                            }
                          ],
                          "redacted": false
                        }
                      },
                      {
                        "key": "female",
                        "interactions": 3083100,
                        "unique_authors": 1031900,
                        "child": {
                          "analysis_type": "freqDist",
                          "parameters": {
                            "target": "li.all.articles.author.member.age",
                            "threshold": 2
                          },
                          "results": [],
                          "redacted": false
                        }
                      }
                    ],
                    "redacted": false
                  }
                }
              ],
              "redacted": false
            }
          }
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          'key1,key1_interactions,key1_unique_authors,' +
          'key2,key2_interactions,key2_unique_authors,' +
          'key3,key3_interactions,key3_unique_authors,' +
          'key4,interactions,unique_authors\n' +
          'yogi,306800,112600,united states,142900,47600,male,4900,3300,35-54,1700,1400\n' +
          'yogi,306800,112600,united states,142900,47600,male,4900,3300,55+,1400,1000\n' +
          'yogi,306800,112600,united states,142900,47600,female,1100,900,35-54,400,300\n' +
          'yogi,306800,112600,united states,142900,47600,female,1100,900,25-34,200,200\n' +
          'yogi,306800,112600,united kingdom,18300,8600,male,600,500,35-54,300,200\n' +
          'yogi,306800,112600,united kingdom,18300,8600,male,600,500,55+,100,100\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,male,31642600,7159000,35-54,12671300,4057000\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,male,31642600,7159000,unknown,8406800,3014300\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,female,10751400,3911300,35-54,3532600,1690100\n' +
          'booboo,985526400,50740500,united states,243311000,15517900,female,10751400,3911300,unknown,2831000,1369100\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,male,8869200,1690400,35-54,3856700,1043000\n' +
          'booboo,985526400,50740500,united kingdom,101058800,3887200,male,8869200,1690400,unknown,2171800,756800\n'
        );
      });
    });

    it("merged - custom nested - 1 level", () => {

      // freqDist: [
      //   {
      //     "foo": [
      //       {
      //         id: "yogi",
      //         filter: 'li.content ANY "trump"',
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         then: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2
      //         }
      //       },
      //       {
      //         id: "booboo",
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         then: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2
      //         }
      //       }
      //     ]
      //   }
      // ]

      let config = [
          {
            "yogi__united states": {
              "interactions": 94700,
              "unique_authors": 24100,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.all.articles.author.member.gender",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "male",
                    "interactions": 3400,
                    "unique_authors": 2100
                  },
                  {
                    "key": "female",
                    "interactions": 800,
                    "unique_authors": 600
                  }
                ],
                "redacted": false
              }
            },
            "yogi__united kingdom": {
              "interactions": 8700,
              "unique_authors": 3500,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.all.articles.author.member.gender",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "male",
                    "interactions": 400,
                    "unique_authors": 300
                  }
                ],
                "redacted": false
              }
            },
            "booboo__united states": {
              "interactions": 252104600,
              "unique_authors": 16171700,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.all.articles.author.member.gender",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "male",
                    "interactions": 33821200,
                    "unique_authors": 7461500
                  },
                  {
                    "key": "female",
                    "interactions": 11180500,
                    "unique_authors": 4007300
                  }
                ],
                "redacted": false
              }
            },
            "booboo__united kingdom": {
              "interactions": 104879600,
              "unique_authors": 3975500,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.all.articles.author.member.gender",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "male",
                    "interactions": 9433500,
                    "unique_authors": 1793500
                  },
                  {
                    "key": "female",
                    "interactions": 3202600,
                    "unique_authors": 1045300
                  }
                ],
                "redacted": false
              }
            }
          }
        ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          'key1,' +
          'key2,key2_interactions,key2_unique_authors,' +
          'key3,interactions,unique_authors\n' +
          'yogi,united states,94700,24100,male,3400,2100\n' +
          'yogi,united states,94700,24100,female,800,600\n' +
          'yogi,united kingdom,8700,3500,male,400,300\n' +
          'booboo,united states,252104600,16171700,male,33821200,7461500\n' +
          'booboo,united states,252104600,16171700,female,11180500,4007300\n' +
          'booboo,united kingdom,104879600,3975500,male,9433500,1793500\n' +
          'booboo,united kingdom,104879600,3975500,female,3202600,1045300\n'
        );
      });
    });

    it("merged - custom nested - 2 level", () => {

      // freqDist: [
      //   {
      //     "foo": [
      //       {
      //         id: "yogi",
      //         filter: 'li.content ANY "trump"',
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         then: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //           then: {
      //             target: "li.user.member.employer_industry_sectors",
      //             threshold: 2
      //           }
      //         }
      //       },
      //       {
      //         id: "booboo",
      //         target: "li.user.member.country",
      //         threshold: 2,
      //         then: {
      //           target: "li.all.articles.author.member.gender",
      //           threshold: 2,
      //           then: {
      //             target: "li.user.member.employer_industry_sectors",
      //             threshold: 2
      //           }
      //         }
      //       }
      //     ]
      //   }
      // ]

      let config =  [
          {
            "yogi__united states__male": {
              "interactions": 3200,
              "unique_authors": 1900,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 300,
                    "unique_authors": 200
                  },
                  {
                    "key": "finance",
                    "interactions": 200,
                    "unique_authors": 100
                  }
                ],
                "redacted": false
              }
            },
            "yogi__united states__female": {
              "interactions": 800,
              "unique_authors": 600,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [],
                "redacted": false
              }
            },
            "yogi__united kingdom__male": {
              "interactions": 300,
              "unique_authors": 200,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [],
                "redacted": false
              }
            },
            "yogi__united kingdom__female": {
              "interactions": 100,
              "unique_authors": 100,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [],
                "redacted": false
              }
            },
            "booboo__united states__male": {
              "interactions": 31645000,
              "unique_authors": 7159000,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 6069300,
                    "unique_authors": 1157200
                  },
                  {
                    "key": "finance",
                    "interactions": 4093700,
                    "unique_authors": 861000
                  }
                ],
                "redacted": false
              }
            },
            "booboo__united states__female": {
              "interactions": 10752000,
              "unique_authors": 3911300,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 1967500,
                    "unique_authors": 639200
                  },
                  {
                    "key": "finance",
                    "interactions": 1354700,
                    "unique_authors": 495200
                  }
                ],
                "redacted": false
              }
            },
            "booboo__united kingdom__male": {
              "interactions": 8869800,
              "unique_authors": 1690400,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "high-tech",
                    "interactions": 1411400,
                    "unique_authors": 227600
                  },
                  {
                    "key": "corporate",
                    "interactions": 1322400,
                    "unique_authors": 206200
                  }
                ],
                "redacted": false
              }
            },
            "booboo__united kingdom__female": {
              "interactions": 3083300,
              "unique_authors": 1031900,
              "analysis": {
                "analysis_type": "freqDist",
                "parameters": {
                  "target": "li.user.member.employer_industry_sectors",
                  "threshold": 2
                },
                "results": [
                  {
                    "key": "corporate",
                    "interactions": 489400,
                    "unique_authors": 132300
                  },
                  {
                    "key": "high-tech",
                    "interactions": 423300,
                    "unique_authors": 123100
                  }
                ],
                "redacted": false
              }
            }
          }
        ]
      ;

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          'key1,' +
          'key2,key2_interactions,key2_unique_authors,' +
          'key3,interactions,unique_authors\n' +

          'yogi,united states,male,3200,1900,high-tech,300,200\n' +
          'yogi,united states,male,3200,1900,finance,200,100\n' +
          'booboo,united states,male,31645000,7159000,high-tech,6069300,1157200\n' +
          'booboo,united states,male,31645000,7159000,finance,4093700,861000\n' +
          'booboo,united states,female,10752000,3911300,high-tech,1967500,639200\n' +
          'booboo,united states,female,10752000,3911300,finance,1354700,495200\n' +
          'booboo,united kingdom,male,8869800,1690400,high-tech,1411400,227600\n' +
          'booboo,united kingdom,male,8869800,1690400,corporate,1322400,206200\n' +
          'booboo,united kingdom,female,3083300,1031900,corporate,489400,132300\n' +
          'booboo,united kingdom,female,3083300,1031900,high-tech,423300,123100\n'
        );
      });
    });

    it.skip("custom nested - 2 level", () => {

      // todo - renew with LI data
      let config = [
        {
          "Media/News/Publishing": [
            {
              key: "http://bit.ly/1rFFkPW",
              interactions: 17800,
              unique_authors: 17400
            },
            {
              key: "http://bit.ly/1olFbiq",
              interactions: 16700,
              unique_authors: 13100
            }
          ],
          "News/Media": [
            {
              key: "https://www.yaklai.com/entertainment/kellytanapat-ninechanuchtra/",
              interactions: 10800,
              unique_authors: 10400
            },
            {
              key: "https://www.yaklai.com/lifestyle/special-article/lose-life-forest-fire-in-thailand/",
              interactions: 6200,
              unique_authors: 6000
            }
          ]
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key2,interactions,unique_authors\n" +
            "Media/News/Publishing,http://bit.ly/1rFFkPW,17800,17400\n" +
            "Media/News/Publishing,http://bit.ly/1olFbiq,16700,13100\n" +
            "News/Media,https://www.yaklai.com/entertainment/kellytanapat-ninechanuchtra/,10800,10400\n" +
            "News/Media,https://www.yaklai.com/lifestyle/special-article/lose-life-forest-fire-in-thailand/,6200,6000\n"
        );
      });
    });

    it.skip("custom nested - 2 level - empty result set", () => {
      let config = [
        {
          "United States__25-34": [
            { key: "BMW", interactions: 55300, unique_authors: 51400 },
            {
              key: "Honda Civic",
              interactions: 23900,
              unique_authors: 20600
            }
          ],
          "United States__35-44": [
            { key: "BMW", interactions: 34300, unique_authors: 29000 },
            { key: "Cars", interactions: 14500, unique_authors: 12600 }
          ],
          "United States__18-24": [
            { key: "BMW", interactions: 33400, unique_authors: 29000 },
            {
              key: "Honda Civic",
              interactions: 18100,
              unique_authors: 16400
            }
          ],
          "United States__45-54": [
            { key: "BMW", interactions: 21000, unique_authors: 19000 },
            { key: "Cars", interactions: 9200, unique_authors: 8600 }
          ],
          "United States__55-64": [
            { key: "BMW", interactions: 9400, unique_authors: 8300 },
            { key: "Cars", interactions: 4800, unique_authors: 4400 }
          ],
          "United States__65+": [
            { key: "BMW", interactions: 4500, unique_authors: 3900 },
            { key: "Cars", interactions: 2500, unique_authors: 2100 }
          ],
          "Turkey__25-34": [
            { key: "BMW", interactions: 26700, unique_authors: 23700 },
            {
              key: "Honda Civic",
              interactions: 3800,
              unique_authors: 3600
            }
          ],
          "Turkey__18-24": [
            { key: "BMW", interactions: 24700, unique_authors: 22900 },
            { key: "Honda", interactions: 3600, unique_authors: 3500 }
          ],
          "Turkey__35-44": [
            { key: "BMW", interactions: 7800, unique_authors: 6700 },
            {
              key: "Honda Civic",
              interactions: 1100,
              unique_authors: 1000
            }
          ],
          "Turkey__45-54": [
            { key: "BMW", interactions: 2200, unique_authors: 2000 },
            { key: "Audi USA", interactions: 200, unique_authors: 200 }
          ],
          "Turkey__65+": [],
          "Turkey__55-64": []
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key2,key3,interactions,unique_authors\n" +
            "United States,25-34,BMW,55300,51400\n" +
            "United States,25-34,Honda Civic,23900,20600\n" +
            "United States,35-44,BMW,34300,29000\n" +
            "United States,35-44,Cars,14500,12600\n" +
            "United States,18-24,BMW,33400,29000\n" +
            "United States,18-24,Honda Civic,18100,16400\n" +
            "United States,45-54,BMW,21000,19000\n" +
            "United States,45-54,Cars,9200,8600\n" +
            "United States,55-64,BMW,9400,8300\n" +
            "United States,55-64,Cars,4800,4400\n" +
            "United States,65+,BMW,4500,3900\n" +
            "United States,65+,Cars,2500,2100\n" +
            "Turkey,25-34,BMW,26700,23700\n" +
            "Turkey,25-34,Honda Civic,3800,3600\n" +
            "Turkey,18-24,BMW,24700,22900\n" +
            "Turkey,18-24,Honda,3600,3500\n" +
            "Turkey,35-44,BMW,7800,6700\n" +
            "Turkey,35-44,Honda Civic,1100,1000\n" +
            "Turkey,45-54,BMW,2200,2000\n" +
            "Turkey,45-54,Audi USA,200,200\n"
        );
      });
    });

    it.skip("custom nested - 3 level", () => {
      let config = [
        {
          "Turkey__sahibinden.com__Cars": [
            { key: "like", interactions: 1500, unique_authors: 1500 },
            { key: "comment", interactions: 100, unique_authors: 100 }
          ],
          "United States__youtu.be__Cars": [
            { key: "like", interactions: 1100, unique_authors: 1100 },
            { key: "comment", interactions: 600, unique_authors: 400 }
          ],
          "United States__youtube.com__Cars": [
            { key: "like", interactions: 1200, unique_authors: 1200 },
            { key: "comment", interactions: 500, unique_authors: 400 }
          ]
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key2,key3,key4,interactions,unique_authors\n" +
            "Turkey,sahibinden.com,Cars,like,1500,1500\n" +
            "Turkey,sahibinden.com,Cars,comment,100,100\n" +
            "United States,youtu.be,Cars,like,1100,1100\n" +
            "United States,youtu.be,Cars,comment,600,400\n" +
            "United States,youtube.com,Cars,like,1200,1200\n" +
            "United States,youtube.com,Cars,comment,500,400\n"
        );
      });
    });
  });

  describe("timeSeries", () => {
    it.skip("Single Task", () => {
      let config = [
        {
          key: "2016-03-07 00:00:00",
          interactions: 490600,
          unique_authors: 432800
        },
        {
          key: "2016-03-08 00:00:00",
          interactions: 526300,
          unique_authors: 447700
        },
        {
          key: "2016-03-09 00:00:00",
          interactions: 666400,
          unique_authors: 596000
        },
        {
          key: "2016-03-10 00:00:00",
          interactions: 724600,
          unique_authors: 599100
        },
        {
          key: "2016-03-11 00:00:00",
          interactions: 683900,
          unique_authors: 599100
        },
        {
          key: "2016-03-12 00:00:00",
          interactions: 515200,
          unique_authors: 438500
        },
        {
          key: "2016-03-13 00:00:00",
          interactions: 690700,
          unique_authors: 608900
        },
        {
          key: "2016-03-14 00:00:00",
          interactions: 611200,
          unique_authors: 505000
        },
        {
          key: "2016-03-15 00:00:00",
          interactions: 410900,
          unique_authors: 355200
        },
        {
          key: "2016-03-16 00:00:00",
          interactions: 457700,
          unique_authors: 383200
        },
        {
          key: "2016-03-17 00:00:00",
          interactions: 414500,
          unique_authors: 367900
        },
        {
          key: "2016-03-18 00:00:00",
          interactions: 398700,
          unique_authors: 352800
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,interactions,unique_authors\n" +
            "2016-03-07 00:00:00,490600,432800\n" +
            "2016-03-08 00:00:00,526300,447700\n" +
            "2016-03-09 00:00:00,666400,596000\n" +
            "2016-03-10 00:00:00,724600,599100\n" +
            "2016-03-11 00:00:00,683900,599100\n" +
            "2016-03-12 00:00:00,515200,438500\n" +
            "2016-03-13 00:00:00,690700,608900\n" +
            "2016-03-14 00:00:00,611200,505000\n" +
            "2016-03-15 00:00:00,410900,355200\n" +
            "2016-03-16 00:00:00,457700,383200\n" +
            "2016-03-17 00:00:00,414500,367900\n" +
            "2016-03-18 00:00:00,398700,352800\n"
        );
      });
    });
  });

  describe("Hybrid", () => {
    it.skip("TimeSeries - nested custom freqDist - 2 levels", () => {
      /*"timeSeries": [
        {
          "interval": "month",
          "then": {
            "type": "freqDist",
            "target": "fb.type",
            "threshold": 2,
            "then": {
              "target": "fb.parent.topics.name",
              "threshold": 2
            }
          }
        }
       ]
       */

      let config = [
        {
          "2016-04-01 00:00:00__like": [
            {
              key: "BMW",
              interactions: 4518700,
              unique_authors: 3410200
            },
            {
              key: "Ford Mustang",
              interactions: 803100,
              unique_authors: 571800
            }
          ],
          "2016-04-01 00:00:00__reshare": [
            {
              key: "BMW",
              interactions: 1327300,
              unique_authors: 1230900
            },
            { key: "Pará", interactions: 272100, unique_authors: 258100 }
          ],
          "2016-03-01 00:00:00__like": [
            {
              key: "BMW",
              interactions: 4518700,
              unique_authors: 3410200
            },
            {
              key: "Ford Mustang",
              interactions: 803100,
              unique_authors: 571800
            }
          ],
          "2016-03-01 00:00:00__reshare": [
            {
              key: "BMW",
              interactions: 1327300,
              unique_authors: 1230900
            },
            { key: "Pará", interactions: 272100, unique_authors: 258100 }
          ]
        }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,key2,key3,interactions,unique_authors\n" +
            "2016-04-01 00:00:00,like,BMW,4518700,3410200\n" +
            "2016-04-01 00:00:00,like,Ford Mustang,803100,571800\n" +
            "2016-04-01 00:00:00,reshare,BMW,1327300,1230900\n" +
            "2016-04-01 00:00:00,reshare,Pará,272100,258100\n" +
            "2016-03-01 00:00:00,like,BMW,4518700,3410200\n" +
            "2016-03-01 00:00:00,like,Ford Mustang,803100,571800\n" +
            "2016-03-01 00:00:00,reshare,BMW,1327300,1230900\n" +
            "2016-03-01 00:00:00,reshare,Pará,272100,258100\n"
        );
      });
    });
  });

  describe("Escaping Characters", () => {
    it.skip("commas and pipes in strings", () => {
      let config = [
        { key: "m|ale", interactions: 10100300, unique_authors: 6022000 },
        { key: "fem,ale", interactions: 3271000, unique_authors: 2674400 }
      ];

      return format.jsonToCsv(config).then(function(result) {
        expect(result).to.be.an("string");
        expect(result).to.eql(
          "key1,interactions,unique_authors,key2\n" +
            "m|ale,10100300,6022000\n" +
            '"fem,ale",3271000,2674400\n'
        );
      });
    });
  });
});
