# Magellan

Key Features:

    -Responsive React interface
    -Axios for API calls
    -Flexible search
    -Sorting by column
    -Pagination
    -Results per page selection
    -The search is case-insensitive
    -Rows matching ANY of the search terms will be displayed

Additional Recommendations:
-Add input validation
-Implement pagination for large datasets
-Add more advanced filtering options
-Implement loading states

Prerequisites
-Python 3.8+
-Node.js 14+
-pip
-npm

project-root/
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── main.csv
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ └── SearchComponent.js
│ │ ├── App.js
│ │ └── index.js
│ ├── package.json
│ └── README.md
│
└── README.md

cd backend
python -m venv venv
source venv\Scripts\activate
pip flask flask-cors pandas
python app.py
