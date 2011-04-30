# -*- coding: japanese-cp932 -*-
require 'kconv'
require 'nkf'

#�ǂݍ��񂾃t�@�C���̕����R�[�h�\���p�z��
CODES = {
  NKF::JIS      => "JIS",
  NKF::EUC      => "EUC",
  NKF::SJIS     => "SJIS",
  NKF::BINARY   => "BINARY",
  NKF::UNKNOWN  => "���ʎ��s",
  NKF::ASCII    => "ASCII",
  NKF::UTF8  	=> "UTF-8",
  NKF::UTF16    => "UTF-16",
}

class Conv_save

  #�R���o�[�g
  def conv(src,enc,contents)

    #�L�^�t�@�C�����́u�I���W�i���E�t�@�C���� + _�����R�[�h.�g���q�v
    #��:test.txt��EUC�ϊ������ test_euc.txt �ɂȂ�
    # . �ŕ������Ċg���q�ƃt�@�C�������擾
    org = src.split(/\./)
			

    distname = org[0] + "_" + enc + "."
    distname = distname + org[1]

    case enc
      when "sjis"
        contents = Kconv.tosjis(contents)
      when "euc"
        contents = Kconv.toeuc(contents)
      when "jis"
        contents = Kconv.tojis(contents)
      when "utf"
        contents = Kconv.toutf8(contents)
      else
        #�ϊ����Ȃ�
    end

    #�t�@�C���ɋL�^
    make_file(distname,contents)

  end
		
  #�t�@�C���ۑ�
  def make_file(filename,str)
    f = File.open(filename,'w')
    f.puts str
    f.close
  end
end

#�N���X�̃C���X�^���X�𐶐�
CS = Conv_save.new

#�ϊ����t�@�C�����̓R�}���h���C����������擾
#�R�}���h���C������������
if ARGV.length > 0
  #2�ȏ�̃t�@�C�����w�肳��Ă���
  if ARGV.length > 1
    print "��x�ɂЂƂ̃t�@�C�����������ł��܂���\n"
    print "�p�X�ɃX�y�[�X���܂ރt�@�C���̏ꍇ��\"\"�Ŋ����Ă�������\n"
    exit
  end
  #�R�}���h���C���������Ȃ�
else
  print "��������t�@�C�������w�肵�Ă�������\n"
  exit
end

#�ŏ��̃R�}���h���C�������������t�@�C�����Ƃ݂Ȃ�
src = ARGV[0]

#�p�X���������t�@�C�����̎��o��
original = File.basename(src)

#��������t�@�C���̂���p�X���擾
src_path = File.dirname(src)
#�J�����g�E�f�B���N�g���ړ�
Dir.chdir(src_path)

#���t�@�C�����J���ē��e��ϐ�$contents�Ɋi�[
f = open(src, "r")
contents = f.read
f.close

#�����R�[�h����
print "\tconvert utf-8 to shift_jis: " + src + "\n"




#�����Ɠ���t�H�[�}�b�g�ł͂Ȃ��Ƃ���͑S�ď�������̂�
#case����unless�̕��������I

#����SJIS�łȂ����
#SJIS�t�@�C���̍쐬
unless NKF.guess(contents)==3
  CS::conv(original,"sjis",contents)
end

exit
