def recommend_schemes(user_input, schemes):
    income = int(user_input.get("income"))
    category = user_input.get("category")

    recommended = []

    for scheme in schemes:
        score = 0

        if income < 300000:
            if "income" in scheme["eligibility"].lower():
                score += 2

        if category.lower() in scheme["category"].lower():
            score += 3

        if category.lower() in scheme["description"].lower():
            score += 1

        recommended.append((scheme, score))

    recommended.sort(key=lambda x: x[1], reverse=True)

    # 🔥 IMPORTANT: return clean dict
    return [
        {
            "_id": str(item[0].get("_id", "")),
            "title": item[0].get("title"),
            "category": item[0].get("category"),
            "description": item[0].get("description"),
            "code": item[0].get("code"),
        }
        for item in recommended[:3]
    ]