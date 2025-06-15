from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            employees = Employee.objects.filter(
                name__icontains=query
            ) | Employee.objects.filter(
                department__icontains=query
            ) | Employee.objects.filter(
                position__icontains=query
            )
        else:
            employees = Employee.objects.all()
        
        serializer = self.get_serializer(employees, many=True)
        return Response(serializer.data)