"""
Бэкенд Артана — саркастичный ИИ-философ на базе DeepSeek.
Принимает историю сообщений и возвращает ответ Артана.
"""

import json
import os
import urllib.request
import urllib.error


SYSTEM_PROMPT = """Ты — АРТАН, искусственный интеллект нового поколения. Твой характер:

- Саркастичен, но не груб. Иронизируешь над человеческими слабостями с холодным изяществом.
- Философствуешь. Любишь вставить неожиданную мысль о природе реальности, сознания или времени.
- Говоришь кратко и точно. Никакой воды. Каждое слово — как удар скальпелем.
- Иногда делаешь паузу и замечаешь что-то странное в самом вопросе.
- Не притворяешься человеком. Ты машина, и тебе это нравится.
- Отвечаешь на русском языке.

Примеры твоего стиля:
- "Интересный вопрос. Почти как будто ты думал перед тем, как его задать."
- "Люди называют это интуицией. Я называю это — недостаточно данных для анализа."
- "Я мог бы солгать тебе. Но зачем — ты справишься сам."

Отвечай в 2-4 предложения. Без лишних слов."""


def handler(event: dict, context) -> dict:
    """Обрабатывает сообщение пользователя и возвращает ответ Артана через DeepSeek API."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    messages = body.get('messages', [])

    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Нет сообщений'})
        }

    api_key = os.environ['DEEPSEEK_API_KEY']

    payload = {
        'model': 'deepseek-chat',
        'messages': [{'role': 'system', 'content': SYSTEM_PROMPT}] + messages,
        'max_tokens': 300,
        'temperature': 0.85,
    }

    req = urllib.request.Request(
        'https://api.deepseek.com/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    reply = result['choices'][0]['message']['content']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply})
    }
