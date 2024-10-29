from . import models
from django.db import models
import unicodedata


class Enum(models.TextChoices):
    @classmethod
    def get_choices_display(cls):
        return [choice[1] for choice in cls.choices]

    @classmethod
    def map_display_to_value(cls, display):
        display_normalized = unicodedata.normalize("NFC", str(display).strip().lower())

        for choice in cls.choices:
            label = choice[1]
            label_normalized = unicodedata.normalize("NFC", str(label).strip().lower())
            if label_normalized == display_normalized:
                return choice[0]
        return None

    @classmethod
    def map_value_to_display(cls, value):
        for choice in cls.choices:
            if choice[0] == value:
                return choice[1]
        return None


class Role(Enum):
    USER = "user", "User"
    ADMIN = "admin", "Admin"


class Gender(Enum):
    MALE = "nam", "Nam"
    FEMALE = "nữ", "Nữ"


class Status(Enum):
    PENDING_APPROVAL = "đang chờ duyệt", "Đang chờ duyệt"
    APPROVED = "đã duyệt", "Đã duyệt"
    REJECTED = "bị từ chối", "Bị từ chối"
    CLOSED = "đã đóng", "Đã đóng"


class EstateType(Enum):
    HOUSE = "nhà", "Nhà"
    LAND = "đất", "Đất"


class Orientation(Enum):
    NORTH = "bắc", "Bắc"
    SOUTH = "nam", "Nam"
    EAST = "đông", "Đông"
    WEST = "tây", "Tây"
    NORTHEAST = "đông bắc", "Đông Bắc"
    NORTHWEST = "tây bắc", "Tây Bắc"
    SOUTHEAST = "đông nam", "Đông Nam"
    SOUTHWEST = "tây nam", "Tây Nam"


class Sale_status(Enum):
    SELLING = "đang bán", "Đang bán"
    NEGOTATING = "đang thương lượng", "Đang thương lượng"
    DEPOSITED = "đã cọc", "Đã cọc"
    SOLD = "đã bán", "Đã bán"


class Legal_status(Enum):
    REDBOOK = "sổ đỏ", "Sổ đỏ"
    PINKBOOK = "sổ hồng", "Sổ hồng"
    NOTYET = "chưa có", "Chưa có"
    OTHER = "khác", "Khác"


class FriendRequest_status(Enum):
    PENDING = "đang chờ", "Đang chờ"
    ACCEPTED = "đã kết bạn", "Đã kết bạn"
    DECLINED = "đã từ chối", "Đã từ chối"
