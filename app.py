from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import openai

app = Flask(__name__)
app.config.from_prefixed_env()
db = SQLAlchemy(app)

# Database Models
class Questions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    data_added = db.Column(db.DateTime, default=datetime.utcnow())

    def __repr__(self):
        return f'<Q{self.id} {self.question}>'


@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'POST' and request.is_json:
        # question = request.get_json('data')['data'] // Get request data here
        
        questions = Questions.query.order_by(Questions.data_added.desc()).all()
        questions = [question.question[:25] + "...." if len(question.question) > 25 else question.question for question in questions]
        
        if not questions:
            questions = "No Questions Found"

        data = {
            "status": "success",
            "questions": questions
        }
        # Return Response
        return jsonify(data)
        
    return render_template('index.html')

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST' and request.is_json:
        question = request.get_json('data')['data']

        # Check if question is asked
        query = Questions.query.filter_by(question=question).first()
        if query:
            # Return Response
            data = {
                "status": "success",
                "question": question,
                "answer": query.answer
            }
            return jsonify(data)

        try:
            openai.api_key = app.config['OPENAI_API_KEY']

            response = openai.Completion.create(
                model="text-davinci-003", 
                prompt=question, 
                temperature=0.5, 
                max_tokens=50
            )
            # Return Response
            data = {
                "status": "success",
                "question": question,
                "answer": response.choices[0]['text']
            }

            record = Questions(question=question, answer=response.choices[0]['text'])
            db.session.add(record)
            db.session.commit()
            return jsonify(data)
        except Exception as e:
            # Return Error
            return jsonify({"status": "error", "message": str(e)})

    return jsonify({"status": "error", "message": "400 Bad Request"})

if __name__=="__main__":
    app.run()