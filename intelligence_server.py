from flask import Flask, request, jsonify
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.orchestrator import run_intelligence

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'BEI Intelligence Server'})

@app.route('/analyse', methods=['POST'])
def analyse():
    try:
        data = request.get_json()
        business_id = data.get('business_id')
        answers = data.get('answers', {})
        industry = data.get('industry', '')
        revenue_band = data.get('revenue_band', 'Under £250k')

        if not business_id:
            return jsonify({'error': 'Missing business_id'}), 400

        result = run_intelligence(answers, business_id, industry, revenue_band)
        return jsonify({'result': result, 'business_id': business_id})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/connector/run', methods=['POST'])
def run_connector():
    try:
        data = request.get_json()
        business_id = data.get('business_id')
        connector_type = data.get('connector_type')
        credentials = data.get('credentials', {})

        if not business_id or not connector_type:
            return jsonify({'error': 'Missing business_id or connector_type'}), 400

        from services.connectors.registry import run_connectors
        result = run_connectors(business_id, [{
            'connector_type': connector_type,
            'credentials': credentials,
        }])

        connector_result = result['results'][0] if result['results'] else {}
        if connector_result.get('success'):
            return jsonify({
                'success': True,
                'connector_type': connector_type,
                'data': connector_result.get('data', {}),
                'synced_at': connector_result.get('synced_at'),
            })
        else:
            return jsonify({
                'success': False,
                'error': connector_result.get('error', 'Connector failed'),
            }), 422

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
