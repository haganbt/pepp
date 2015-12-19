# pepp
PYLON Exporter ++

## STATUS: Unstable, WIP.

**TODO**

* Merged custom nested
* Unlimited nesting hierarchy for custom nested
* Support for merged multi-index queries



## Multi-Index - Merged Native Nested

Region, age, gender request from two indexes:

```json
"analysis": {
    "freqDist": [
        {
            "merged_custom_nested": [
                {
                    "index": "baseline", <-- index credentials
                    "target": "fb.author.region",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.age",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                },
                {
                    "target": "fb.author.region",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.age",
                        "threshold": 2,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                }
            ]
        }
    ]
}        
```        