const transporter = require("../config/mailConfig");
const Otp = require("../models/otp.model");

class SendMail {
  static async verifyEmail(req, user) {
    try {
      const otp = Math.floor(1000 * Math.random() + 9000).toString()
      console.log("otp1", user)
      const newOtp = new Otp({
        userId: user._id,
        otp: otp,
      });
      console.log("otp2")

      await newOtp.save();
      console.log("otp3")

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "otp- verify your account",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              background-color: #4f46e5;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
              ">
                Verify Your Email
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 35px;">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Hello ${user.name},
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.6;
              ">
                Thank you for creating an account with us.
                Please use the verification code below to verify your email address.
              </p>

              <!-- OTP -->
              <div style="
                margin: 30px 0;
                text-align: center;
              ">

                <p style="
                  margin-bottom: 10px;
                  color: #555555;
                  font-size: 15px;
                ">
                  Your Verification Code
                </p>

                <div style="
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: #f3f4f6;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  font-size: 30px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #4f46e5;
                ">
                  ${otp}
                </div>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                This OTP is required to verify your account.
                Please do not share this code with anyone.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                If you did not create this account, you can safely ignore this email.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
              ">
                Thank you,<br />
                <strong>Admin Team</strong>
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              <p style="margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
      });
      return otp;
    } catch (error) {
      throw error;
    }
  }

 static async remderMail(reminder) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: reminder.users.email,
      subject: `Task Reminder: ${reminder.tasks.title}`,

      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Task Reminder</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              background-color: #4f46e5;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
              ">
                Task Reminder
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 35px;">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Hello ${reminder.users.name},
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.6;
              ">
                This is a reminder for your upcoming task. 
                Don't forget to complete it on time.
              </p>

              <!-- Task Details -->
              <div style="
                margin: 25px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
              ">

                <p style="
                  margin: 0 0 15px 0;
                  font-size: 15px;
                  color: #555555;
                ">
                  <strong style="color: #222222;">Task:</strong>
                  ${reminder.tasks.title}
                </p>

                <p style="
                  margin: 0 0 15px 0;
                  font-size: 15px;
                  color: #555555;
                ">
                  <strong style="color: #222222;">Due Date:</strong>
                  ${reminder.tasks.dueDate}
                </p>

                <p style="
                  margin: 0;
                  font-size: 15px;
                  color: #555555;
                ">
                  <strong style="color: #222222;">Priority:</strong>
                  ${reminder.tasks.priority}
                </p>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                Please check your task list and complete this task
                before its due date.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
              ">
                Thank you,<br />
                <strong>Task Planner Team</strong>
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              <p style="margin: 0;">
                This is an automated reminder email. Please do not reply.
              </p>
            </div>

          </div>

        </body>
        </html>
      `,
    });

  } catch (error) {
    throw error;
  }
}
}

module.exports = SendMail;
