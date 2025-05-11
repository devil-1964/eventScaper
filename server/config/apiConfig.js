module.exports = {
  api: {
    url: 'https://api.sydney.com/api/filter', // Update with actual API endpoint
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Referer': 'https://www.sydney.com/events',
      'Referrer-Policy': 'unsafe-url'
    },
    body: {
      "query": {
        "boosting": {
          "positive": {
            "bool": {
              "must": {
                "constant_score": {
                  "filter": {
                    "bool": {
                      "should": [
                        {
                          "bool": {
                            "must": [
                              {"terms": {"bundle": ["atdw_entity","atdw_entity_service"]}},
                              {"terms": {"category": ["EVENT"]}},
                              {"terms": {"region": ["middleware_regions_6305b31132a43"]}},
                              {"term": {"language_with_fallback": "en-AU"}},
                              {"term": {"site": "sydney"}},
                              {
                                "range": {
                                  "event_date_range": {
                                    "gte": "2025-05-08T00:00:00",
                                    "lte": "2026-05-08T23:59:59",
                                    "time_zone": "Australia/Sydney"
                                  }
                                }
                              }
                            ],
                            "must_not": [
                              {"term": {"exclude_from_product_list": true}}
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              },
              "should": []
            }
          },
          "negative": {
            "bool": {
              "should": [
                {"term": {"classification": "HOLHOUSE"}},
                {"term": {"owning_organisation_id": "63b550451a4c9898053b790d"}}
              ],
              "must_not": {
                "terms": {"product_id": []}
              }
            }
          },
          "negative_boost": 0.5
        }
      },
      "aggs": {
        "classification": {
          "terms": {
            "field": "classification",
            "size": 50
          }
        },
        "attributes": {
          "aggs": {
            "facets": {
              "terms": {
                "field": "attributes",
                "size": 50,
                "include": [],
                "exclude": [
                  "ACCESSIBILITY--DISASSIST--WHEELCHAIR",
                  "ACCESSIBILITY--DISASSIST--HEARIMPAIR",
                  "ACCESSIBILITY--DISASSIST--AMBULANT",
                  "ACCESSIBILITY--DISASSIST--VISIONIMPAIR",
                  "ACCESSIBILITY--DISASSIST--COMPANIONCARD",
                  "ACCESSIBILITY--DISASSIST--HIGHSUPPORT"
                ]
              }
            }
          },
          "filters": {
            "filters": {
              "query": {
                "bool": {
                  "filter": {
                    "terms": {
                      "classification": [
                        "FESTIVAL",
                        "PERFORMANC",
                        "EXHIBIT",
                        "EVTMARKET",
                        "SPORT",
                        "EVTFOOD",
                        "EVTBUS",
                        "EVTCOMNTY"
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "accessibility": {
          "aggs": {
            "facets": {
              "terms": {
                "field": "attributes",
                "size": 50,
                "include": [
                  "ACCESSIBILITY--DISASSIST--WHEELCHAIR",
                  "ACCESSIBILITY--DISASSIST--HEARIMPAIR",
                  "ACCESSIBILITY--DISASSIST--AMBULANT",
                  "ACCESSIBILITY--DISASSIST--VISIONIMPAIR",
                  "ACCESSIBILITY--DISASSIST--COMPANIONCARD",
                  "ACCESSIBILITY--DISASSIST--HIGHSUPPORT"
                ],
                "exclude": []
              }
            }
          },
          "filters": {
            "filters": {
              "query": {
                "bool": {
                  "filter": {
                    "terms": {
                      "classification": [
                        "FESTIVAL",
                        "PERFORMANC",
                        "EXHIBIT",
                        "EVTMARKET",
                        "SPORT",
                        "EVTFOOD",
                        "EVTBUS",
                        "EVTCOMNTY"
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "attribute_filters": {
          "aggs": {
            "facets": {
              "terms": {
                "field": "attributes",
                "size": 50,
                "include": [],
                "exclude": [
                  "ACCESSIBILITY--DISASSIST--WHEELCHAIR",
                  "ACCESSIBILITY--DISASSIST--HEARIMPAIR",
                  "ACCESSIBILITY--DISASSIST--AMBULANT",
                  "ACCESSIBILITY--DISASSIST--VISIONIMPAIR",
                  "ACCESSIBILITY--DISASSIST--COMPANIONCARD",
                  "ACCESSIBILITY--DISASSIST--HIGHSUPPORT"
                ]
              }
            }
          },
          "filters": {
            "filters": {
              "query": {
                "bool": {
                  "filter": {
                    "terms": {
                      "classification": [
                        "FESTIVAL",
                        "PERFORMANC",
                        "EXHIBIT",
                        "EVTMARKET",
                        "SPORT",
                        "EVTFOOD",
                        "EVTBUS",
                        "EVTCOMNTY"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post_filter": {
        "bool": {
          "filter": {
            "terms": {
              "classification": [
                "FESTIVAL",
                "PERFORMANC",
                "EXHIBIT",
                "EVTMARKET",
                "SPORT",
                "EVTFOOD",
                "EVTBUS",
                "EVTCOMNTY"
              ]
            }
          }
        }
      },
      "sort": [
        {"_score": {"order": "desc"}},
        {
          "nested_event_dates.date": {
            "order": "asc",
            "mode": "min",
            "nested": {
              "path": "nested_event_dates",
              "filter": {
                "range": {
                  "nested_event_dates.date": {
                    "gte": "2025-05-08",
                    "lte": "2026-05-08"
                  }
                }
              }
            }
          }
        },
        {"page_views": {"order": "desc"}},
        {"title": {"order": "asc"}}
      ],
      "from": 0,
      "size": "15"
    }
  }
};