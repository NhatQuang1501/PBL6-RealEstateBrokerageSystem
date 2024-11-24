from rest_framework import serializers
from accounts.models import *
from application.models import *
from accounts.enums import *
from accounts.serializers import *

class ReportSerializer(serializers.ModelSerializer):
    reported_user_name = serializers.SerializerMethodField()
    reportee_name = serializers.SerializerMethodField()
    reported_user_avt = serializers.SerializerMethodField()
    reportee_avt = serializers.SerializerMethodField()
    class Meta:
        model = Report
        fields = '__all__'
        extra_kwargs = {
            'report_id': {"read_only": True},
            'post': {'required': False},
            'comment': {'required': False},
            'reported_user': {"required": True},
            'reportee': {"required": True},
            'report_type': {"required": True},
            'description': {"required": True},
            'created_at': {'read_only': True},
            'reported_user_name': {'read_only': True},
            'reportee_name': {'read_only': True},
            'reported_user_avt': {'read_only': True},
            'reportee_avt': {'read_only': True},
        }

    def to_internal_value(self, data):
        post = data.get('post_id', None)
        comment = data.get('comment_id', None)
        reported_user = data.get('reported_user_id', None)
        reportee = data.get('reportee_id', None)
        report_type = data.get('report_type', None)

        if not reported_user or not reportee:
            raise serializers.ValidationError('Reported user ID and reportee ID are required')
        
        if not report_type:
            raise serializers.ValidationError('Report type is required')
        
        reported_user = User.objects.get(user_id=reported_user)
        if not reported_user:
            raise serializers.ValidationError('Reported user not found')
        
        reportee = User.objects.get(user_id=reportee)
        if not reportee:
            raise serializers.ValidationError('Reportee not found')
        
        if post:
            post = Post.objects.get(post_id=post)
            if not post:
                raise serializers.ValidationError('Post not found')
            
        if comment:
            comment = PostComment.objects.get(comment_id=comment)
            if not comment:
                raise serializers.ValidationError('Comment not found')
            
        report_type = ReportType.map_display_to_value(report_type)
        
        data.pop('post_id')
        data.pop('comment_id')
        data.pop('reported_user_id')
        data.pop('reportee_id')

        data['reported_user'] = reported_user
        data['reportee'] = reportee
        data['post'] = post
        data['comment'] = comment

        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['reported_user_id'] = instance.reported_user.user_id
        rep['reportee_id'] = instance.reportee.user_id
        rep['report_type'] = ReportType.map_value_to_display(instance.report_type)
        rep['post_id'] = instance.post.post_id if instance.post else None
        rep['comment_id'] = instance.comment.comment_id if instance.comment else None
        rep.pop('reported_user')
        rep.pop('reportee')
        rep.pop('post')
        rep.pop('comment')
        return rep
    
    def create(self, validated_data):
        reported_user = validated_data.get('reported_user')
        reportee = validated_data.get('reportee')
        post = validated_data.get('post')
        comment = validated_data.get('comment')

        if post or comment:
            if post:
                report = Report.objects.filter(reported_user=reported_user, reportee=reportee, post=post)
            else:
                report = Report.objects.filter(reported_user=reported_user, reportee=reportee, comment=comment)
            if report.exists():
                raise serializers.ValidationError('Report already exists')
        else:
            report = Report.objects.filter(reported_user=reported_user, reportee=reportee)
            if report.exists():
                raise serializers.ValidationError('Report already exists')
            
        if post == '':
            validated_data['post'] = None
        if comment == '':
            validated_data['comment'] = None
            
        report = Report.objects.create(**validated_data)
        return report
    
    def get_reported_user_name(self, obj):
        return obj.reported_user.username
    
    def get_reportee_name(self, obj):
        return obj.reportee.username
    
    def get_reported_user_avt(self, obj):
        user_profile = UserProfile.objects.get(user=obj.reported_user)
        return user_profile.avatar.url if user_profile.avatar and hasattr(user_profile.avatar, 'url') else None
    
    def get_reportee_avt(self, obj):
        user_profile = UserProfile.objects.get(user=obj.reportee)
        return user_profile.avatar.url if user_profile.avatar and hasattr(user_profile.avatar, 'url') else None
