package com.jerael.studentrecognition.models

data class AuthResponse(

    var success: Boolean? = null,

    var token: String? = null,

    var type: String? = null

)