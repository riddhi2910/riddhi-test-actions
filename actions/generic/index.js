/*
 * IMS Credentials Injection Test Action
 *
 * Tests whether include-ims-credentials: true annotation correctly injects
 * __ims_oauth_s2s params during deploy, and whether generateAccessToken works.
 *
 * Before fix (aio-apps-action not exporting IMS_OAUTH_S2S_* vars):
 *   hasImsOAuthS2S: false, tokenError: MISSING_PARAMETERS
 *
 * After fix:
 *   hasImsOAuthS2S: true, tokenGenerated: true
 */

const { generateAccessToken } = require('@adobe/aio-lib-core-auth')

async function main (params) {
  const injected = params.__ims_oauth_s2s

  let tokenGenerated = false
  let tokenError = null

  try {
    const token = await generateAccessToken(params)
    tokenGenerated = !!token.access_token
  } catch (e) {
    tokenError = e.message
  }

  return {
    statusCode: 200,
    body: {
      hasImsOAuthS2S: !!injected,
      hasClientId: !!injected?.client_id,
      hasClientSecret: !!injected?.client_secret,
      hasOrgId: !!injected?.org_id,
      hasScopes: !!injected?.scopes,
      tokenGenerated,
      tokenError
    }
  }
}

exports.main = main
