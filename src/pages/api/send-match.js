import Mailjet from 'node-mailjet';

export const config = {
  api: {
    externalResolver: true,
  },
}

export default async function handler(req, res) {

  const { method } = req;
  if (method !== "POST") {
    throw new Error("Only POST requests allowed");
  }
  
  const { name, email } = await req.body;
  if (!name || !email) {
    throw new Error("Missing email or name of user being sent to");
  }

    try {
      const mailjet = await new Mailjet({
        apiKey: process.env.REACT_APP_MJ_APIKEY_PUBLIC || 'your-api-key',
        apiSecret: process.env.REACT_APP_MJ_APIKEY_PRIVATE || 'your-api-secret',
        config: {
          host: 'api.mailjet.com',
          version: 'v3.1',
          output: 'text',
        }
      });

      const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
              Messages: [
                {
                  From: {
                    Email: process.env.REACT_APP_SENDER_EMAIL,
                    Name: process.env.REACT_APP_SENDER_NAME
                  },
                  To: [
                    {
                      Email: email,
                      Name: name
                    }
                  ],
                  Subject: `You found a match!`,
                  HTMLPart: `<!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!--[if mso]><xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch><o:allowpng></o:officedocumentsettings></xml><![endif]--><style>*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}@media (max-width:520px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}</style></head><body style="margin:0;background-color:#ffadad;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#ffadad"><tbody><tr><td><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#ffadad;color:#000;width:500px;margin:0 auto" width="500"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%"><div class="alignment" align="center" style="line-height:10px"><div style="max-width:262px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1100255_1085676/full-logo.png" style="display:block;height:auto;border:0;width:100%" width="262" alt="cupid" title="cupid"></div></div></td></tr></table><table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><h1 style="margin:0;color:#ff3875;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:38px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;mso-line-height-alt:45.6px"><span class="tinyMce-placeholder">You found a match!</span></h1></td></tr></table><table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div class="alignment" align="center"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="divider_inner" style="font-size:1px;line-height:1px;border-top:1px solid #ddd"><span>&#8202;</span></td></tr></table></div></td></tr></table><table class="html_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;text-align:center" align="center"><img src="https://media.giphy.com/media/MeIucAjPKoA120R7sN/giphy.gif" alt="funny GIF" width="100%"></div></td></tr></table><table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="color:#101112;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:120%;text-align:left;mso-line-height-alt:19.2px"><p style="margin:0">Check your account to find out who it is and reach out! Get to know each other, and<strong>don't be afraid to be yourself.</strong>&nbsp;</p></div></td></tr></table><table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://yourcupid.vercel.app/" style="height:42px;width:181px;v-text-anchor:middle" arcsize="10%" stroke="false" fillcolor="#ff3875"><w:anchorlock><v:textbox inset="0px,0px,0px,0px"><center style="color:#fff;font-family:Arial,sans-serif;font-size:16px"><![endif]--><a href="https://yourcupid.vercel.app/" target="_blank" style="text-decoration:none;display:inline-block;color:#fff;background-color:#ff3875;border-radius:4px;width:auto;border-top:0 solid transparent;font-weight:400;border-right:0 solid transparent;border-bottom:0 solid transparent;border-left:0 solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal"><span style="word-break:break-word;line-height:32px">Check your account</span></span></a><!--[if mso]><![endif]--></div></td></tr></table><table class="paragraph_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="color:#101112;direction:ltr;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:16px;font-weight:400;letter-spacing:0;line-height:120%;text-align:left;mso-line-height-alt:19.2px"><p style="margin:0">Note that after this, your account won't work for finding matches! You can still send out invites but you will never know if someone likes you back. Go on be happy with your new match!</p></div></td></tr></table><div class="spacer_block block-8" style="height:25px;line-height:25px;font-size:1px">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`
                }
              ]
            })

      request
            .then((result) => {
              console.log("Result:", result.body)
              return res.status(200).json({ message: 'Email sent successfully', data: result.body })
            })
            .catch((err) => {
              console.log("Error:", err.statusCode)
              return res.status(500).json({ message: 'Email sending failed', error: err.statusCode })
            })
    } catch (err) {
      console.log("Error:", err)
      return res.status(500).json({ message: 'Email sending failed', error: err })
    }
}