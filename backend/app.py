import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

CSV_PATH_1 = '../data/organization.csv'
CSV_PATH_2 = '../data/project.csv'

# Load the two CSV files that we want to decrease the workload
try:
    df1 = pd.read_csv(CSV_PATH_1, dtype=str)
    df2 = pd.read_csv(CSV_PATH_2, dtype=str)
except FileNotFoundError:
    print(
        f"Warning: '{CSV_PATH_1}' or '{CSV_PATH_2}' not found. Creating dummy files for demonstration.")
    
df_merged = pd.merge(df1, df2, on='Project ID', how='outer')

# Fill NaN values with '_' as in your original code
df_filled = df_merged.fillna('_')


@app.route('/search', methods=['POST'])
def search_dataframe():
    search_terms = request.json.get('search_terms', [])

    if not search_terms:
        return jsonify({'data': [], 'columns': []})

    # Initialize mask to all True
    mask = pd.Series([True] * len(df_filled))

    # Apply each term to the 'Project Topic' column with AND logic
    for term in search_terms:
        # Ensure 'Project Topic' exists in the merged DataFrame
        if 'Project Topic' in df_filled.columns:
            term_mask = df_filled['Project Topic'].astype(str).str.contains(
                fr'\b{re.escape(term)}\b', case=False, na=False, regex=True
            )
            mask = mask & term_mask
        else:
            print("Warning: 'Project Topic' column not found in merged DataFrame.")
            # You might want to return an error or search in another column
            return jsonify({'error': "'Project Topic' column not found in database"}, 400)

    results_df = df_filled[mask]
    unique_topics = results_df['Project Topic'].unique()
    response_data = []

    for topic in unique_topics:
        project_entries = results_df[results_df['Project Topic'] == topic]

        # EXACT MATCH for "Coordinator" (capital C)
        coordinator = project_entries[project_entries['Organization Role']
                                      == 'Coordinator']

        if len(coordinator) > 0:
            coordinator_data = coordinator.iloc[0].to_dict()
        else:
            coordinator_data = project_entries.iloc[0].to_dict()

        # Get participants (EXACT MATCH for non-Coordinators)
        participants = project_entries[project_entries['Organization Role']
                                       != 'Coordinator']
        participants_data = participants.to_dict('records')

        response_data.append({
            'coordinator': coordinator_data,
            'participants': participants_data,
            'project_topic': topic
        })

    return jsonify({
        'data': response_data,
        'columns': list(results_df.columns)
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)