using LookingForGroup.Api;

namespace LookingForGroup
{
    public class DataContracts
    {
        /* Add each of your hubs and api controllers for which you need data contracts like this:
        
        public Hub1 Hub1 { get; set; }
        public DummyApiController { get; set; }
    
        */
        public AccountApiController AccountApiController { get; set; }
        public FindApiController FindApiController { get; set; }


    }
}