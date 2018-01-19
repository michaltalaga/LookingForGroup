using LookingForGroup.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace LookingForGroup.Controllers
{
    public class HomeController : Controller
    {
        UsersRepository usersRepository = new UsersRepository();    
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        [Route("Login")]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        [Route("Login")]
        public ActionResult Login(LoginData data)
        {
            throw new NotSupportedException();
            //if (!Request.IsLocal) return View();
            //var user = usersRepository.FindByEmail(data.Email);
            //if (user == null)
            //{
            //    return View();
            //}
            //Login(user);
            //return Redirect("/Account");
        }
        [Route("Clean")]
        public void Clean()
        {
            var usersToDelete = usersRepository.Query(u => !u.BattleTag.Contains("#"));
            usersToDelete.ToList().ForEach(u => usersRepository.Remove(u));
        }
        [Route("CleanAll")]
        public void CleanAll()
        {
            var usersToDelete = usersRepository.Query(u => true);
            usersToDelete.ToList().ForEach(u => usersRepository.Remove(u));
        }
        [Route("Generate")]
        public void Generate()
        {
            Clean();
            usersRepository.Add(new Models.User()
            {
                //Email = "mt1",
                CountryCode = "PL",
                BattleTag = "mt1_123",
                AvailabilityPeriods = new AvailabilityPeriod[]
                {
                    new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(8,0,0), EndTime = new TimeSpan(10,0,0)}
                }
            });
            usersRepository.Add(new Models.User()
            {
                //Email = "mt2",
                CountryCode = "PL",
                BattleTag = "mt2_123",
                AvailabilityPeriods = new AvailabilityPeriod[]
                {
                    new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(8,0,0), EndTime = new TimeSpan(10,0,0)},
                    new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(12,0,0), EndTime = new TimeSpan(16,0,0)}
                }
            });
            usersRepository.Add(new Models.User()
            {
                //Email = "mt3",
                CountryCode = "PL",
                BattleTag = "mt3_123",
                AvailabilityPeriods = new AvailabilityPeriod[]
                {
                    //new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(8,0,0), EndTime = new TimeSpan(10,0,0)},
                    new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(12,0,0), EndTime = new TimeSpan(16,0,0)},
                    new AvailabilityPeriod() { Day = DayOfWeek.Monday, StartTime = new TimeSpan(18,0,0), EndTime = new TimeSpan(22,0,0)}
                }
            });
            UserHelper.GenerateRandom(100).ToList().ForEach(u => usersRepository.Add(u));
            //return RedirectToAction(nameof(Index));
        }

       

        [Route("Logout")]
        public ActionResult Logout()
        {
            var ctx = Request.GetOwinContext();
            var authenticationManager = ctx.Authentication;
            authenticationManager.SignOut();
            return RedirectToAction(nameof(Login));
        }
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            //return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Home", new { ReturnUrl = returnUrl }));
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Home", new { ReturnUrl = returnUrl }));
        }
        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        [Route("ExternalLoginCallback")]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {

            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            var battleTag = loginInfo.ExternalIdentity.Claims.Single(c => c.Type == "urn:battlenet:battletag").Value;
            //if (loginInfo?.Email == null)
            //{
            //    return RedirectToAction(nameof(Login));
            //}
            var user = usersRepository.FindByBattleTag(battleTag);
            if (user == null)
            {
                var countryAndRegion = await GetCountryCodeAndRegionCode(Request.UserHostAddress);
                user = new User()
                {
                    //Email = loginInfo.Email,
                    //Nick = loginInfo.Email.Split('@')[0],
                    BattleTag = battleTag,
                    CountryCode = countryAndRegion.countryCode,
                    Region = countryAndRegion.region,
                    MinRank = Rank.Bronze5,
                    MaxRank = Rank.GrandMaster
                };
                usersRepository.Add(user);
            }
            Login(user);
            return Redirect("/Account");
            //// Sign in the user with this external login provider if the user already has a login
            //var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            //switch (result)
            //{
            //    case SignInStatus.Success:
            //        return RedirectToLocal(returnUrl);
            //    case SignInStatus.LockedOut:
            //        return View("Lockout");
            //    case SignInStatus.RequiresVerification:
            //        return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
            //    case SignInStatus.Failure:
            //    default:
            //        // If the user does not have an account, then prompt the user to create an account
            //        ViewBag.ReturnUrl = returnUrl;
            //        ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
            //        return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            //}
        }

        private async Task<(string countryCode, string region)> GetCountryCodeAndRegionCode(string userHostAddress)
        {
            using (var webClient = new WebClient())
            {
                try
                {
                    var responseString = await webClient.DownloadStringTaskAsync(new Uri("http://api.ipdata.co/" + userHostAddress));
                    dynamic response = Newtonsoft.Json.JsonConvert.DeserializeObject(responseString);
                    var continent = (string)response.continent_name;
                    var region = continent == "Europe" ? "Europe" : continent == "Asia" ? "Asia" : "Americas";
                    return (response.country_code, region);                    
                }
                catch
                {
                    return ("VA", "Europe");
                }

            }
        }

        private void Login(User user)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Name, user.BattleTag));
            //claims.Add(new Claim(ClaimTypes.Email, user.Email));
            var id = new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie);

            var ctx = Request.GetOwinContext();
            var authenticationManager = ctx.Authentication;
            authenticationManager.SignIn(id);
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        //[HttpPost]
        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        //public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        //{
        //    if (User.Identity.IsAuthenticated)
        //    {
        //        return RedirectToAction("Index", "Home");
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        // Get the information about the user from the external login provider
        //        var info = await AuthenticationManager.GetExternalLoginInfoAsync();
        //        if (info == null)
        //        {
        //            return View("ExternalLoginFailure");
        //        }
        //        throw new Exception();
        //        //var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        //        //var result = await UserManager.CreateAsync(user);
        //        //if (result.Succeeded)
        //        //{
        //        //    result = await UserManager.AddLoginAsync(user.Id, info.Login);
        //        //    if (result.Succeeded)
        //        //    {
        //        //        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
        //        //        return RedirectToLocal(returnUrl);
        //        //    }
        //        //}
        //        //AddErrors(result);
        //    }

        //    ViewBag.ReturnUrl = returnUrl;
        //    return View(model);
        //}
        private const string XsrfKey = "XsrfId";
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }
        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                //redirectUri = "https://lookingforgroup.gg/ExternalLoginCallback";
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
    }
    public class ExternalLoginConfirmationViewModel
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Display(Name = "Email")]
        public string Email { get; set; }
    }
    public class LoginData
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Remember { get; set; }
    }
}