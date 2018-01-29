using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.AspNet.Identity;
using System.Net.Http;
using Newtonsoft.Json;
using System.Net;
using System.Threading.Tasks;
using LookingForGroup.Models;
using Microsoft.Owin.Security.Cookies;
using Owin.Security.Providers.BattleNet;
using System.Web.Configuration;

namespace LookingForGroup
{
    public class Startup
    {
        public static object o;
        public void Configuration(IAppBuilder app)
        {
            System.Web.Helpers.AntiForgeryConfig.UniqueClaimTypeIdentifier = System.Security.Claims.ClaimsIdentity.DefaultNameClaimType;
            var hubConfiguration = new HubConfiguration();

            //app.MapSignalR(hubConfiguration);
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Login"),
                Provider = new CookieAuthenticationProvider()
                {
                    OnApplyRedirect = ctx =>
                    {
                        if (!IsApiRequest(ctx.Request))
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                    }
                }
            });
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);
            //var options = new Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions()
            //{
            //    AppId = "473122666380977",
            //    AppSecret = "01e5097c01532011e8826581a26c8f54",
            //    BackchannelHttpHandler = new HttpClientHandler(),
            //};
            //options.Fields.Add("email");
            //options.Scope.Add("email");
            //app.UseFacebookAuthentication(options);
            var options = new BattleNetAuthenticationOptions()
            {
                ClientId = WebConfigurationManager.AppSettings["BattleNetKey"],
                ClientSecret = WebConfigurationManager.AppSettings["BattleNetSecret"],
                //BackchannelHttpHandler = new HttpClientHandler(),
                
            };
            o = options;
            options.Scope.Clear();
            app.UseBattleNetAuthentication(options);
        }
        private static bool IsApiRequest(IOwinRequest request)
        {
            string apiPath = VirtualPathUtility.ToAbsolute("~/api/");
            return request.Uri.LocalPath.StartsWith(apiPath);
        }
    }

  
}