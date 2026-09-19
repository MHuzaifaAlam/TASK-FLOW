class RequestLoggingMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response

    def __call__(self,request):
        if request.path=="/admin-area/":
            from django.http import HttpResponse
            return HttpResponse("Acess Denied")
        print("before view")
        response=self.get_response(request)
        print("After View")
        return response
