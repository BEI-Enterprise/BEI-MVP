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


# ============================================================
# OAUTH ENDPOINTS
# Handle OAuth flows for all connectors that require it.
# Tokens stored in Supabase connectors table.
# ============================================================

@app.route('/oauth/<connector_type>/url', methods=['POST'])
def get_oauth_url(connector_type):
    """Generate OAuth authorisation URL for a connector."""
    try:
        data = request.get_json()
        client_id = data.get('client_id')
        redirect_uri = data.get('redirect_uri')

        if not client_id or not redirect_uri:
            return jsonify({'error': 'Missing client_id or redirect_uri'}), 400

        if connector_type == 'hubspot':
            from services.connectors.hubspot import get_oauth_url
            url = get_oauth_url(client_id, redirect_uri)

        elif connector_type == 'xero':
            from services.connectors.xero import get_oauth_url
            client_secret = data.get('client_secret', '')
            url = get_oauth_url(client_id, redirect_uri)

        elif connector_type == 'quickbooks':
            from services.connectors.quickbooks import get_oauth_url
            url = get_oauth_url(client_id, redirect_uri)

        elif connector_type == 'salesforce':
            from services.connectors.salesforce import get_oauth_url
            url = get_oauth_url(client_id, redirect_uri)

        elif connector_type == 'google_analytics':
            from services.connectors.google_analytics import get_oauth_url
            url = get_oauth_url(client_id, redirect_uri)

        else:
            return jsonify({'error': f'OAuth not supported for {connector_type}'}), 400

        return jsonify({'oauth_url': url})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/oauth/<connector_type>/exchange', methods=['POST'])
def exchange_oauth_code(connector_type):
    """Exchange OAuth authorisation code for tokens."""
    try:
        data = request.get_json()
        code = data.get('code')
        redirect_uri = data.get('redirect_uri')
        client_id = data.get('client_id')
        client_secret = data.get('client_secret')

        if not all([code, redirect_uri, client_id, client_secret]):
            return jsonify({'error': 'Missing required OAuth parameters'}), 400

        if connector_type == 'hubspot':
            from services.connectors.hubspot import exchange_code_for_tokens
            tokens = exchange_code_for_tokens(code, redirect_uri, client_id, client_secret)

        elif connector_type == 'xero':
            from services.connectors.xero import exchange_code_for_tokens
            tokens = exchange_code_for_tokens(code, redirect_uri, client_id, client_secret)

        elif connector_type == 'quickbooks':
            from services.connectors.quickbooks import exchange_code_for_tokens
            realm_id = data.get('realm_id', '')
            tokens = exchange_code_for_tokens(code, redirect_uri, client_id, client_secret, realm_id)

        elif connector_type == 'salesforce':
            from services.connectors.salesforce import exchange_code_for_tokens
            tokens = exchange_code_for_tokens(code, redirect_uri, client_id, client_secret)

        elif connector_type == 'google_analytics':
            from services.connectors.google_analytics import exchange_code_for_tokens
            tokens = exchange_code_for_tokens(code, redirect_uri, client_id, client_secret)

        else:
            return jsonify({'error': f'OAuth not supported for {connector_type}'}), 400

        return jsonify({'success': True, 'tokens': tokens})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/oauth/<connector_type>/refresh', methods=['POST'])
def refresh_oauth_token(connector_type):
    """Refresh an expired OAuth access token."""
    try:
        data = request.get_json()
        refresh_token = data.get('refresh_token')
        client_id = data.get('client_id')
        client_secret = data.get('client_secret')

        if not all([refresh_token, client_id, client_secret]):
            return jsonify({'error': 'Missing refresh_token, client_id or client_secret'}), 400

        if connector_type == 'hubspot':
            from services.connectors.hubspot import refresh_access_token
            tokens = refresh_access_token(refresh_token, client_id, client_secret)

        elif connector_type == 'xero':
            from services.connectors.xero import refresh_access_token
            tokens = refresh_access_token(refresh_token, client_id, client_secret)

        elif connector_type == 'quickbooks':
            from services.connectors.quickbooks import refresh_access_token
            tokens = refresh_access_token(refresh_token, client_id, client_secret)

        elif connector_type == 'salesforce':
            from services.connectors.salesforce import refresh_access_token
            tokens = refresh_access_token(refresh_token, client_id, client_secret)

        elif connector_type == 'google_analytics':
            from services.connectors.google_analytics import refresh_access_token
            tokens = refresh_access_token(refresh_token, client_id, client_secret)

        else:
            return jsonify({'error': f'Token refresh not supported for {connector_type}'}), 400

        return jsonify({'success': True, 'tokens': tokens})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
