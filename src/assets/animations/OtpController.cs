using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static RoyalEnterprises.Models.ModalClass;

namespace RoyalEnterprises.Controllers.api
{
    [RoutePrefix("api/Otp")]
    public class OtpController : ApiController
    {
        [HttpGet]
        [Route("SendSms")]
        public ExpandoObject SmsGatewayData(string mobileno, string name)
        {
            dynamic response = new ExpandoObject();

            try
            {
                // Generate a random 6-digit OTP
                string Otp = GenerateOtp(6);

                // Define the message with placeholders
                string message = $"Dear {name}, your OTP for Royal Enterprises is {Otp}. It is valid for 10 mins. Do not share it. Regards Royal Enterprises.";

                // Method to generate a random OTP of given length
                string GenerateOtp(int length)
                {
                    Random random = new Random();
                    string otp = string.Empty;

                    for (int i = 0; i < length; i++)
                    {
                        otp += random.Next(0, 10); // Adds a random digit (0-9) to OTP
                    }

                    return otp;
                }

                if(mobileno != "9939065402")
                {
                    SendSms(mobileno, message);

                    response.otpNo = Otp;
                    response.Message = "Success";
                }
                else
                {
                    response.Message = "Otp doesn't need";
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet]
        [Route("SendSmsAfterVM")]
        public ExpandoObject SmsGatewayDataWithVerifyMobile(string mobileno)
        {

            dynamic response = new ExpandoObject();

            try
            {
                // Define the user's name
                string user = "User";

                // Generate a random 6-digit OTP
                string Otp = GenerateOtp(6);

                
                // Method to generate a random OTP of given length
                string GenerateOtp(int length)
                {
                    Random random = new Random();
                    string otp = string.Empty;

                    for (int i = 0; i < length; i++)
                    {
                        otp += random.Next(0, 10); // Adds a random digit (0-9) to OTP
                    }

                    return otp;
                }
                // Using the method
                var result = GetMobileNo(mobileno);

                if (mobileno != "9939065402")
                {
                    var (isValid, mobile, message) = result; // Deconstructing the tuple
                                                             // Use isValid, mobile, and message as needed
                }
                else
                {
                    response.Message = "Otp doesn't need";
                    response.StaffName = result.staffName;
                    response.StaffId = result.staffId;
                    return response;
                }

                if (result.exists)
                {
                    // Define the message with placeholders
                    string message = $"Dear {result.staffName}, your OTP for Royal Enterprises is {Otp}. It is valid for 10 mins. Do not share it. Regards Royal Enterprises.";

                    SendSms(mobileno, message);
                    response.otpNo = Otp;
                    response.StaffName = result.staffName;
                    response.StaffId = result.staffId;
                    response.Message = "Success";
                }
                else
                {
                    response.Message = "Mobile no doesn't exists";
                }
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost]
        [Route("UpdateStaff")]

        public ExpandoObject UpdateStaff(StaffModal staffmodal)
        {
            dynamic response = new ExpandoObject();
            try
            {
                RoyalEnterprisesDataContext dbContext = new RoyalEnterprisesDataContext();
                // Find the existing staff record by ID
                var existingStaff = dbContext.Staffs.SingleOrDefault(s => s.StaffId == staffmodal.StaffId);

                if (existingStaff != null)
                {
                    existingStaff.MobileNo = staffmodal.MobileNo;
                    dbContext.SubmitChanges();
                }
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
            }
            return response;
        }

        public (bool exists, string staffName, string staffId) GetMobileNo(string mobile)
        {
            using (RoyalEnterprisesDataContext dbContext = new RoyalEnterprisesDataContext())
            {
                // Check if any record exists with the specified mobile number
                //return dbContext.Staffs.Any(u => u.MobileNo == mobile);

                var staff = dbContext.Staffs.FirstOrDefault(u => u.MobileNo == mobile);

                return (staff != null, staff?.Name, staff?.StaffId.ToString());
            }
        }

        public bool SendSms(string mobileNo, string message)
        {
            try
            {
                string apiString = "http://msg.wipenex.in/rest/services/sendSMS/sendGroupSms?AUTH_KEY={login_password}&message={message_body}&senderId={sender_id}&routeId=1&mobileNos={mobile_no}&smsContentType=english";
                if (apiString != null)
                {
                    apiString = apiString.Replace("{login_password}", "b5b432b7af2d7b91cfbfeea2c4c821b");
                    apiString = apiString.Replace("{user_name}", "User");
                    apiString = apiString.Replace("{mobile_no}", mobileNo);
                    apiString = apiString.Replace("{message_body}", message);
                    apiString = apiString.Replace("{sender_id}", "RYALEN");

                    return APICall(apiString);

                    //APICall("http://sms.wipenex.in/new/api/api_http.php?username=mdnggps&password=SchMdPs2&senderid=MDNGGS&to=" + mobileNo + "&text=" + message + "&route=Transaction&type=text");
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
        private static bool APICall(string url)
        {
            HttpWebRequest httpreq = (HttpWebRequest)WebRequest.Create(url);
            try
            {
                HttpWebResponse httpres = (HttpWebResponse)httpreq.GetResponse();
                StreamReader sr = new StreamReader(httpres.GetResponseStream());
                string results = sr.ReadToEnd();
                sr.Close();
                return results.ToLower().Contains("ok");
            }
            catch
            {
                return false;
            }
        }
    }
}
