import * as nodemailer from 'nodemailer';
export class EmailService {
  static async sendEmail(to: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `
            <head>
                
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                
                <link href="https://fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
                
                <style type="text/css">
                    @media only screen and (max-width: 550px){
                        .responsive_at_550{
                            width: 90% !important;
                            max-width: 90% !important;
                        }
                    }
                </style>
            
            </head>
            <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
                
                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">        
                    <tbody>
                        <tr>
                            <td align="center" bgcolor="#1976D2">
                                
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td width="100%" align="center">
                                                
                                                
                                                <!-- START SPACING -->
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td height="40">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table width="500" border="0" cellpadding="0" cellspacing="0" align="center" style="padding-left:20px; padding-right:20px;" class="responsive_at_550">
                                                    <tbody>
                                                        <tr>
                                                            <td align="center" bgcolor="#ffffff">
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%" height="7" align="center" border="0" bgcolor="#03a9f4"></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td height="30">&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="90%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%" align="center">
                                                                                <h1 style="font-family:'Ubuntu Mono', monospace; font-size:20px; color:#202020; font-weight:bold; padding-left:20px; padding-right:20px;">Reset your password</h1>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!-- END HEADING -->
                                                                
                                                                <!-- START PARAGRAPH -->
                                                                <table width="90%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%" align="center">
                                                                                <p style="font-family:'Ubuntu', sans-serif; font-size:14px; color:#202020; padding-left:20px; padding-right:20px; text-align:justify;">You received this E-mail in response to your request to reset your password.</p>
                                                                                <p style="font-family:'Ubuntu', sans-serif; font-size:14px; color:#202020; padding-left:20px; padding-right:20px; text-align:justify;">Click the button below to reset your password, the reset password link is only valid for 15 minute.</p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td height="30">&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!-- END SPACING -->
                                                                
                                                                <!-- START BUTTON -->
                                                                <table width="200" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td align="center" bgcolor="#1976D2">
                                                                                <a style="font-family:'Ubuntu Mono', monospace; display:block; color:#ffffff; font-size:14px; font-weight:bold; text-decoration:none; padding-left:20px; padding-right:20px; padding-top:20px; padding-bottom:20px;" href="${message}">Reset Password</a>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!-- END BUTTON -->
                                                                
                                                                <!-- START SPACING -->
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td height="30">&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                
                                                                <table width="90%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="100%" align="center">
                                                                                <p style="font-family:'Ubuntu', sans-serif; font-size:14px; color:#202020; padding-left:20px; padding-right:20px; text-align:justify;">If the above button doesn't work, you can reset your password by clicking the following link, <a href="${message}">Reset password</a>.</p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td height="30">&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td height="40">&nbsp;</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>        
                </table>
            </body>
            `,
    };

    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {    
      return { error: `Failed to send email to ${to}` };
    }

    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      return { error: `Failed to send email to ${to}` };
    }
  }
}
