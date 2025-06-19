from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

todos = {}

@app.route('/')
def index():
    start_date = request.args.get('start_date')
    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    else:
        start_date = datetime.today()
    week_dates = [(start_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]
    week_todos = {date: todos.get(date, []) for date in week_dates}
    return render_template('index.html', week_dates=week_dates, week_todos=week_todos)

@app.route('/add', methods=['POST'])
def add():
    date = request.form.get('date')
    summary = request.form.get('summary')
    details = request.form.get('details', '')  # デフォルト値を空文字に設定
    start_date = request.form.get('start_date') or request.args.get('start_date')  # スタート日付を取得

    if date and summary:
        if date not in todos:
            todos[date] = []
        todos[date].append({'summary': summary, 'details': details, 'status': '未'})

    # スタート日付を保持してリダイレクト
    return redirect(url_for('index', start_date=start_date))

@app.route('/delete/<date>/<int:todo_id>')
def delete(date, todo_id):
    start_date = request.args.get('start_date')  # スタート日付を取得
    if date not in todos:
        return jsonify({'error': 'Invalid date'}), 404
    if not (0 <= todo_id < len(todos[date])):
        return jsonify({'error': 'Invalid todo_id'}), 404
    todos[date].pop(todo_id)
    return redirect(url_for('index', start_date=start_date))

@app.route('/update_status/<date>/<int:todo_id>', methods=['POST'])
def update_status(date, todo_id):
    if date in todos and 0 <= todo_id < len(todos[date]):
        status = request.json.get('status')
        if status in ['未', '中', '済']:
            todos[date][todo_id]['status'] = status
            return jsonify({'success': True})
    return jsonify({'success': False}), 400

@app.route('/move_todo', methods=['POST'])
def move_todo():
    pass  # このエンドポイントは削除されました

if __name__ == '__main__':
    app.run(debug=True)
