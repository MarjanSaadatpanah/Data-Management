import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the CSV file
CSV_PATH = 'main.csv'
df = pd.read_csv(CSV_PATH)
df_filled = df.fillna('_')


@app.route('/search', methods=['POST'])
def search_dataframe():
    """
    Endpoint for searching the DataFrame based on search terms
    """
    search_terms = request.json.get('search_terms', [])

    # Search logic
    mask = False
    for term in search_terms:
        term_mask = df_filled.astype(str).apply(
            lambda x: x.str.contains(term, case=False, na=False)).any(axis=1)
        mask = mask | term_mask

    results_df = df_filled[mask]

    # Count projects contributed by each organisation
    if 'Organization' in results_df.columns and 'Project Topic' in results_df.columns:
        organization_counts = results_df.groupby(
            'Organization')['Project Topic'].count().to_dict()
        results_df['Number of Searched Contributed Projects'] = results_df['Organization'].map(
            organization_counts)

    # Define column order
    column_order = [
        'NO', 'Acronym', 'Project Topic', 'Project ID', 'Start Date', 'End Date',
        'Total Cost', 'Programme', 'Topic', 'Call for Proposal', 'Source',
        'Organization Role', 'Organization', 'Number of Searched Contributed Projects',
        'Country', 'Project or Organ Linkedin', 'Net EU Contribution',
        'Contact', 'Role', 'Email', 'Phone', 'Linkedin'
    ]

    # Insert row numbers
    results_df.insert(0, 'NO', range(1, len(results_df) + 1))

    # Ensure only specified columns are displayed
    columns_to_display = [
        col for col in column_order if col in results_df.columns]

    return jsonify({
        'data': results_df[columns_to_display].to_dict(orient='records'),
        'columns': columns_to_display
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
