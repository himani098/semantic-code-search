import json
import requests

API_URL = "http://127.0.0.1:8000/query"

with open("evaluation/evaluation.json", "r", encoding="utf-8") as f:
    tests = json.load(f)

results = []

passed = 0

for test in tests:
    response = requests.post(
        API_URL,
        json={"question": test["question"]}
    )

    answer = response.json()["answer"]

    score = test["expected"].lower() in answer.lower()

    if score:
        passed += 1

    results.append({
        "question": test["question"],
        "expected": test["expected"],
        "answer": answer,
        "passed": score
    })

total = len(tests)

accuracy = (passed / total) * 100

print("\nEvaluation Report")
print("----------------------")
print(f"Passed: {passed}/{total}")
print(f"Accuracy: {accuracy:.2f}%")

with open("evaluation/report.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=4)

print("Evaluation completed!")