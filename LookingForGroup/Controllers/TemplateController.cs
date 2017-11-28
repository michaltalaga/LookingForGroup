using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LookingForGroup.Controllers
{
    public class TemplateController : Controller
    {
        protected override void HandleUnknownAction(string actionName)
        {

            View(actionName).ExecuteResult(ControllerContext);

        }
    }
}