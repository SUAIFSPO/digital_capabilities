package com.jerael.studentrecognition.ui

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import com.jerael.studentrecognition.R
import com.jerael.studentrecognition.utils.recoveryPassword
import com.jerael.studentrecognition.utils.showToast
import kotlinx.android.synthetic.main.activity_password_recovery.*
import android.R.attr.label

class PasswordRecoveryActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_password_recovery)

        this.title = "Восстановление пароля"

        this.supportActionBar?.setDisplayHomeAsUpEnabled(true)

        button_recovery.setOnClickListener {

            val login = recovery_login.text.toString()
            val word = recovery_word.text.toString()

            if (checkFields(login, word)) {
                recoveryPassword(this, login, word) { password ->
                    if (password != null) {

                        val message = "Ваш пароль cкопирован в буфер обмена"

                        val clipboard: ClipboardManager =
                            getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText(label.toString(), password)
                        clipboard.setPrimaryClip(clip)

                        showToast(message)
                        finish()
                    }
                }
            }
        }
    }

    private fun checkFields(login: String, fio: String): Boolean {

        return when {
            login.contains(" ") -> {
                showToast("Пробелы в поле Логин недопустимы")
                false
            }
            login.isEmpty() -> {
                showToast("Поле Логин не может быть пустым")
                false
            }
            fio.isEmpty() -> {
                showToast("Поле ФИО не может быть пустым")
                false
            }
            else -> {
                true
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        return when (item.itemId) {
            android.R.id.home -> {
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}