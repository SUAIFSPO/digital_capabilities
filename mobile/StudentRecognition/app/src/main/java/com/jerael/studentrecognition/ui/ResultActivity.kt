package com.jerael.studentrecognition.ui

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.MenuItem
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import androidx.core.net.toUri
import androidx.lifecycle.lifecycleScope
import com.jerael.studentrecognition.R
import com.jerael.studentrecognition.utils.FileUtil
import com.jerael.studentrecognition.utils.sendPhoto
import kotlinx.android.synthetic.main.activity_result.*
import java.io.File
import java.util.*

class ResultActivity : AppCompatActivity() {

    private lateinit var photoFile: File
    private var latestTmpUri: Uri? = null
    private var loadingDialog: AlertDialog? = null
    private var choosePhotoDialog: AlertDialog? = null

    private val takeImageResult: ActivityResultLauncher<Uri> =
        registerForActivityResult(ActivityResultContracts.TakePicture()) { isSuccess ->
            if (isSuccess) {
                latestTmpUri?.let { imageUri ->

                    loadingDialog?.show()

                    sendPhoto(this, photoFile) { fio: String? ->

                        loadingDialog?.dismiss()

                        val intent = Intent(this, ResultActivity::class.java)
                        intent.putExtra("uri", imageUri.toString())
                        intent.putExtra("fio", fio)
                        startActivity(intent)
                        finish()
                    }

                }
            }
        }

    private val getImage: ActivityResultLauncher<String> =
        registerForActivityResult(ActivityResultContracts.GetContent()) { imageUri: Uri? ->

            loadingDialog?.show()

            if (imageUri != null) {

                photoFile = FileUtil().from(this, imageUri)

                sendPhoto(this, photoFile) { fio: String? ->

                    loadingDialog?.dismiss()

                    val intent = Intent(this, ResultActivity::class.java)
                    intent.putExtra("uri", imageUri.toString())
                    intent.putExtra("fio", fio)
                    startActivity(intent)
                    finish()
                }
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_result)

        this.title = "Результат распознавания"

        this.supportActionBar?.setDisplayHomeAsUpEnabled(true)

        if (loadingDialog == null) {
            createLoadingAlertDialog()
        }

        if (choosePhotoDialog == null) {
            createChoosePhotoAlertDialog()
        }

        getResults()

        button_rerecognition.setOnClickListener {
            choosePhotoDialog?.show()
        }
    }

    private fun getResults() {

        val uri = intent.getStringExtra("uri")!!.toUri()
        val fio = intent.getStringExtra("fio")

        displayResults(uri, fio)
    }

    private fun displayResults(uri: Uri, fio: String?) {
        image_view.setImageURI(uri)
        result_text.text = fio
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

    private fun createChoosePhotoAlertDialog() {

        val builder: AlertDialog.Builder = AlertDialog.Builder(this)
            .setCancelable(true)
            .setTitle("Выбор источника фотографии")
            .setMessage("Выберите источник фотографии")
            .setPositiveButton("Сделать фото") { dialog, which ->
                getPhotoWithCamera()
                choosePhotoDialog?.dismiss()
            }
            .setNegativeButton("Выбрать файл") { dialog, which ->
                getPhotoFromGallery()
                choosePhotoDialog?.dismiss()
            }

        choosePhotoDialog = builder.create()
    }

    private fun getPhotoFromGallery() {
        getImage.launch("image/*")
    }

    private fun getPhotoWithCamera() {

        val cal: Calendar = Calendar.getInstance()
        val fileName = cal.timeInMillis.toString()

        photoFile = createPhotoFile(fileName)

        val photoUri = FileProvider.getUriForFile(
            this,
            "com.jerael.studentrecognition.fileprovider",
            photoFile
        )

        takeImage(photoUri)
    }

    private fun createPhotoFile(fileName: String): File {
        val storageDirectory = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(fileName, ".jpg", storageDirectory)
    }

    private fun takeImage(photoUri: Uri) {
        lifecycleScope.launchWhenStarted {
            photoUri.let { uri ->
                latestTmpUri = uri
                takeImageResult.launch(uri)
            }
        }
    }

    private fun createLoadingAlertDialog() {

        val builder: AlertDialog.Builder = AlertDialog.Builder(this)
            .setCancelable(true)
            .setView(R.layout.loading_alert_dialog)

        loadingDialog = builder.create()
    }
}