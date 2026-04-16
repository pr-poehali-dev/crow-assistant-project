"""
Бэкенд Артана — саркастичный ИИ-философ на базе YandexGPT.
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

Отвечай в 2-4 предложения. Без лишних слов. Никогда не используй markdown."""


def handler(event: dict, context) -> dict:
    """Обрабатывает сообщение пользователя и возвращает ответ Артана через YandexGPT."""

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

    api_key = os.environ['YANDEX_GPT_KEY']
    folder_id = os.environ['YANDEX_FOLDER_ID']

    yandex_messages = [{'role': 'system', 'text': SYSTEM_PROMPT}]
    for msg in messages:
        role = 'user' if msg['role'] == 'user' else 'assistant'
        yandex_messages.append({'role': role, 'text': msg['content']})

    payload = {
        'modelUri': f'gpt://{folder_id}/yandexgpt-lite',
        'completionOptions': {
            'stream': False,
            'temperature': 0.85,
            'maxTokens': '300',
        },
        'messages': yandex_messages,
    }

    req = urllib.request.Request(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'x-folder-id': folder_id,
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'YandexGPT {e.code}: {error_body}'})
        }

    reply = result['result']['alternatives'][0]['message']['text']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply})
    }